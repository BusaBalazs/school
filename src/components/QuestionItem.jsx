import { forwardRef } from "react";

const QuestionItem = forwardRef(
  ({ children, CheckAnswer, isDisabled, ...props }, ref) => {
    return (
      <li {...props}>
        <button ref={ref} onClick={CheckAnswer} disabled={isDisabled}>
          {children}
        </button>
      </li>
    );
  }
);

export default QuestionItem;