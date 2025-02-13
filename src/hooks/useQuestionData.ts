import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type QuestionData = {
  type: string;
  difficult: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  userAnswer?: string;
};

type QuestionResponse = {
  results: QuestionData[];
};

const fetchData = async (): Promise<QuestionResponse> => {
  const response = await axios.get<QuestionResponse>(
    "https://opentdb.com/api.php?amount=5&type=multiple"
  );
  return response.data;
};

export function useQuestionData() {
  const query = useQuery({
    queryFn: fetchData,
    queryKey: ["question"],
    refetchOnWindowFocus: false,
    enabled: false,
    select: (data) => ({
      ...data,
      results: data.results.map((question) => ({
        ...question,
        userAnswer: "",
      })),
    }),
  });
  return { ...query, data: query.data?.results };
}
