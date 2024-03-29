<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import TabButton from "./components/TabButton.vue";
import QuestionAccordion from "./components/QuestionAccordion.vue";
import { Question } from "./types";
import {
  useAsyncState,
  useIntervalFn,
  useImage,
  useTimeoutFn,
} from "@vueuse/core";
import LoadingSpinner from "./components/LoadingSpinner.vue";
import { useI18n } from "vue-i18n";
import bgImgUrl from "./assets/img/bg.png";
import { currentWeek, safeParseJwt, isWeekQuestionsReleased } from "./utils";

const queryParams = new URLSearchParams(window.location.search);
const theme = queryParams.get("theme");
document.body.classList.add("theme-" + theme);

console.log("Current week: " + currentWeek);
let modifier = 0;
if (!isWeekQuestionsReleased(currentWeek)) {
  modifier = 1;
}

const weeks = [...Array(currentWeek - modifier).keys()].map((i) => i + 1);
const queryParamWeek = queryParams.get("week");
const queryParamWeekNumber = queryParamWeek ? parseInt(queryParamWeek) : null;
const queryParamWeekNumberValid =
  queryParamWeekNumber &&
  isFinite(queryParamWeekNumber) &&
  queryParamWeekNumber > 0 &&
  currentWeek >= queryParamWeekNumber;

const activeWeek = ref(
  queryParamWeekNumberValid ? queryParamWeekNumber : currentWeek - modifier
);

const fontsLoading = ref(true);

onMounted(() => {
  document.fonts.ready.then(() => {
    fontsLoading.value = false;
  });
});

const i18n = useI18n();
const contentLanguageQueryParam = queryParams.get("content-language");

const cached = ref<{ [key: number]: Question[] }>({});
const fetchWeek = async (week: number) => {
  //if (cached.value[week]) return cached.value[week];
  const locale = contentLanguageQueryParam || i18n.locale.value;
  var result = await fetch(
    import.meta.env.BASE_URL + `weeks/${week}/${locale}.json`
  );
  if (result.status == 404 && locale != "nb") {
    // Check if there is a fallback
    result = await fetch(import.meta.env.BASE_URL + `weeks/${week}/nb.json`);
  }
  if (result.status > 399) throw new Error("Failed to fetch questions");
  // { "1": { "question": "Hva er 1+1?", "answer": "2" } }
  const raw = await result.json();
  const qas: Question[] = [];
  for (const key in raw) {
    const qNum = parseInt(key, 10);
    if (isNaN(qNum)) continue;
    const record = raw[qNum];
    const question = record.question?.trim();
    const answer = record.answer?.trim();
    if (question && answer) {
      qas.push({
        question,
        answer,
      });
    }
  }
  cached.value[week] = qas;
  return qas;
};

const questionsPromise = ref<Promise<Question[]>>(fetchWeek(activeWeek.value));
watch(activeWeek, (week) => {
  questionsPromise.value = fetchWeek(week);
});

const questionsSnapshot = computed(() =>
  useAsyncState(questionsPromise.value, null)
);

const questions = computed(() => {
  return questionsSnapshot.value.state.value;
});
const setWeek = (week: number) => {
  activeWeek.value = week;
};

declare var android: any;

const openSubmission = () => {
  if (typeof android !== "undefined") {
    (android as any).openQuestionSubmission();
  }
  var win = window as any;
  if (win.webkit) {
    win.webkit.messageHandlers.openQuestionSubmission.postMessage("");
  }
};

const accessToken = ref<string | undefined>(
  (window as any).xamarin_webview?.accessToken
);

const { pause } = useIntervalFn(() => {
  const token = (window as any).xamarin_webview?.accessToken;
  if (token) {
    accessToken.value = token;
    pause();
  }
}, 100);

const { isLoading } = useImage({ src: bgImgUrl, loading: "eager" });
const bgLoading = ref(true);
watch(isLoading, (loading) => {
  if (!loading) {
    bgLoading.value = false;
  }
});

useTimeoutFn(() => {
  if (bgLoading.value) {
    bgLoading.value = false;
  }
}, 1000);

const parsedToken = computed(() => safeParseJwt(accessToken.value));
const testers = import.meta.env.VITE_TESTERS?.split(",") || [];
const forceNotTester = ref(false);
const isTester = computed(() => {
  if (forceNotTester.value) return false;
  if (import.meta.env.DEV) return true;
  const userId = parsedToken.value?.["https://members.bcc.no/app_metadata"]?.[
    "personId"
  ] as string | undefined;
  if (!userId) return false;
  return parsedToken.value && testers.includes(userId.toString());
});

const showToken = ref(false);

const showQuestions = computed(() => {
  return (
    questions.value &&
    questions.value.length > 0 &&
    (isWeekQuestionsReleased(activeWeek.value) || isTester.value)
  );
});
</script>

<template>
  <div
    class="w-screen h-screen bg-background-1 overflow-x-hidden overflow-y-scroll flex items-stretch flex-col"
  >
    <div
      class="w-2 h-2 aspect-square bg-study-light rounded-full absolute top-4 right-8 opacity-0"
      @click="showToken = true"
    ></div>
    <div
      class="absolute z-50 top-0 left-0 w-full h-full bg-study-light bg-opacity-90 flex flex-col items-center justify-center"
      @click="showToken = false"
      v-if="showToken"
    >
      <p>Token: {{ parsedToken }}</p>
      <p>Tester: {{ isTester }}</p>
      <p>Released: {{ isWeekQuestionsReleased(activeWeek) }}</p>
      <p>Week: {{ activeWeek }}</p>
      <button @click="forceNotTester = true">Force not tester</button>
    </div>
    <div
      class="shrink-0 pb-4 pt-2 px-4 border-b border-b-separator flex overflow-x-scroll no-scrollbar"
      :class="{ invisible: fontsLoading }"
    >
      <TabButton
        v-for="week in weeks.sort((a, b) => b - a)"
        :key="week"
        :active="activeWeek == week"
        @click="setWeek(week)"
        class="mr-2"
      >
        {{ $t("week") }} {{ week }}
      </TabButton>
    </div>

    <div
      class="flex flex-col items-center justify-center py-6 px-8 flex-1"
      v-if="fontsLoading || questionsSnapshot.isLoading.value || bgLoading"
    >
      <LoadingSpinner />
    </div>
    <div v-else class="flex flex-col items-center flex-1 select-none">
      <div
        v-if="false"
        class="m-2 rounded-3xl text-study-dark overflow-hidden relative bg-study-light"
        :class="{
          'flex-1': !questionsSnapshot.isLoading.value && !showQuestions,
        }"
      >
        <img
          class="absolute top-0 left-0 w-full h-full object-cover z-10 pointer-events-none object-top"
          :src="bgImgUrl"
          alt="Background Image"
        />
        <div
          class="relative flex flex-col items-center justify-center py-12 px-8 h-full z-20 w-full"
        >
          <svg
            class="fill-current"
            width="51"
            height="51"
            viewBox="0 0 36 36"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="path-1-inside-1_7013_73435" fill="white">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15.75 4.5H15L14.9803 4.52078C11.4814 4.70991 8.16414 6.18332 5.67373 8.67373C3.00133 11.3461 1.5 14.9707 1.5 18.75C1.5 22.5293 3.00134 26.1539 5.67373 28.8263C8.34612 31.4987 11.9707 33 15.75 33V28.5H22.5C29.1274 28.5 34.5 23.1274 34.5 16.5C34.5 9.87258 29.1274 4.5 22.5 4.5H18H15.75Z"
              />
            </mask>
            <path
              d="M15 4.5V1.5H13.7096L12.8222 2.43675L15 4.5ZM14.9803 4.52078L15.1422 7.51641L16.336 7.45188L17.1582 6.58403L14.9803 4.52078ZM5.67373 8.67373L3.55241 6.55241L3.55241 6.55241L5.67373 8.67373ZM5.67373 28.8263L3.55241 30.9476H3.55241L5.67373 28.8263ZM15.75 33V36H18.75V33H15.75ZM15.75 28.5V25.5H12.75V28.5H15.75ZM15 7.5H15.75V1.5H15V7.5ZM17.1582 6.58403L17.1778 6.56325L12.8222 2.43675L12.8025 2.45753L17.1582 6.58403ZM7.79505 10.795C9.76113 8.82897 12.3801 7.66571 15.1422 7.51641L14.8184 1.52516C10.5828 1.7541 6.56715 3.53767 3.55241 6.55241L7.79505 10.795ZM4.5 18.75C4.5 15.7663 5.68526 12.9048 7.79505 10.795L3.55241 6.55241C0.317405 9.78741 -1.5 14.175 -1.5 18.75H4.5ZM7.79505 26.705C5.68526 24.5952 4.5 21.7337 4.5 18.75H-1.5C-1.5 23.325 0.317406 27.7126 3.55241 30.9476L7.79505 26.705ZM15.75 30C12.7663 30 9.90483 28.8147 7.79505 26.705L3.55241 30.9476C6.78741 34.1826 11.175 36 15.75 36V30ZM12.75 28.5V33H18.75V28.5H12.75ZM22.5 25.5H15.75V31.5H22.5V25.5ZM31.5 16.5C31.5 21.4706 27.4706 25.5 22.5 25.5V31.5C30.7843 31.5 37.5 24.7843 37.5 16.5H31.5ZM22.5 7.5C27.4706 7.5 31.5 11.5294 31.5 16.5H37.5C37.5 8.21573 30.7843 1.5 22.5 1.5V7.5ZM18 7.5H22.5V1.5H18V7.5ZM15.75 7.5H18V1.5H15.75V7.5Z"
              fill="currentColor"
              mask="url(#path-1-inside-1_7013_73435)"
            />
          </svg>
          <h2 class="mt-2 text-style-title-1 text-study-dark">
            {{ $t("askQuestionTitle") }}
          </h2>
          <p class="mt-2 text-style-subtitle-2 text-study-dark">
            {{ $t("askQuestionDescription") }}
          </p>
          <div
            class="mt-4 button bg-study-dark text-study-light"
            @click="openSubmission"
          >
            {{ $t("askQuestionButton") }}
          </div>
        </div>
      </div>
      <div class="w-full" v-if="showQuestions">
        <QuestionAccordion
          v-for="(question, index) in questions"
          :key="question.question"
          :question="question"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
