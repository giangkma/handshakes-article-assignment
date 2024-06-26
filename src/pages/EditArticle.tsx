import { useNavigate, useParams } from "react-router-dom";
import { ArticleForm } from "../components/ArticleForm";
import { Loading } from "../components/Loading";
import { useArticleDetail } from "../hooks/useArticleDetail";

export const EditArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, article } = useArticleDetail(id);

  const onGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-3/4 mx-auto my-20">
      {loading && <Loading />}
      <div className="flex items-center gap-4">
        <button onClick={onGoBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
            />
          </svg>
        </button>
        <p className="font-medium text-xl text-gray-700">
          Edit Article: {article?.title}
        </p>
      </div>

      <ArticleForm article={article} />
    </div>
  );
};
