import { ReactNode } from "react";

type QuestionProps = {
  children: ReactNode;
  category: string;
  question: string;
};

export default function QuestionContainer({
  children,
  category,
  question,
}: QuestionProps) {
  return (
    <div className="flex flex-col items-start max-lg:items-center">
      <span className="text-sm bg-light_purple text-soft_white px-2 py-1 rounded mb-2">
        {category}
      </span>
      <h2 className="text-2xl font-semibold mb-2 text-dark_purple max-lg:text-center">
        {question}
      </h2>
      <div className="flex gap-3 mb-4 max-lg:flex-col">{children}</div>
      <div className="w-full h-[2px] bg-light_gray mb-4 rounded" />
    </div>
  );
}
