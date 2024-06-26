import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Article } from "../components/Article";
import { LoadMoreSpiner } from "../components/LoadMoreSpiner";
import { Loading } from "../components/Loading";
import { ModalArticleDelete } from "../components/ModalArticleDelete";
import { InputText } from "../components/form/InputText";
import { useArticlesList } from "../hooks/useArticlesList";
import { IArticle } from "../models/article";
import { deleteArticleAPI } from "../services/articles";
import { formatNumber } from "../ultils";
import { LIMIT_ARTICLE_ITEMS } from "../configs";

export const HomePage = () => {
  const {
    articles,
    loading,
    setLoading,
    isHasMore,
    onGetMore,
    searchValue,
    setSearchValue,
    currentPage,
    total,
    scrollRef,
    refeshData,
  } = useArticlesList();

  const [articleDelete, setArticleDelete] = useState<IArticle | undefined>(
    undefined
  );

  const onDeleteArticle = async () => {
    try {
      setLoading(true);
      if (!articleDelete) return;
      setArticleDelete(undefined);
      await deleteArticleAPI(articleDelete.id);
      await refeshData();
      toast("Article deleted successfully");
    } catch (error) {
      console.log("error :>> ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {loading && <Loading />}
      <div className="lg:w-1/2 w-3/4 mx-auto my-6">
        <p className="mb-5 text-gray-600 font-light underline">
          HandshakesByDC/news-article-assignment
        </p>
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold text-green-900 text-2xl font">
            {formatNumber(total)} ARTICLES FOUND
          </p>
          <div className="flex items-center gap-2">
            <Link to="/new-article">
              <button className="border font-medium px-3 py-2 shadow-sm bg-green-800 text-white rounded-lg hover:shadow-xl transform transition-all duration-300">
                + Add New Article
              </button>
            </Link>
            <button
              onClick={refeshData}
              className="border font-medium px-3 py-2 shadow-sm bg-blue-500 text-white rounded-lg hover:shadow-xl transform transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
        </div>
        <InputText
          name="search"
          placeholder="Enter to search by Title, Publisher or Summary"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {articles.length === 0 ? (
          <div className="text-center text-gray-600 font-light mt-4">
            No articles found, please add new article
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <code className="mt-4 block text-gray-600">
                {LIMIT_ARTICLE_ITEMS} articles per page
              </code>
              <code className="mt-4 block text-gray-600">
                1 - {formatNumber(articles.length)} of {formatNumber(total)}
              </code>
            </div>
            <div
              className="h-[40rem] overflow-y-scroll mt-4 pr-4"
              ref={scrollRef}
            >
              <InfiniteScroll
                loadMore={() => {
                  currentPage.current++;
                  onGetMore({
                    isReset: false,
                  });
                }}
                hasMore={isHasMore}
                useWindow={false}
                loader={<LoadMoreSpiner />}
              >
                {articles.map((article, index) => {
                  return (
                    <Article
                      article={article}
                      onClickDelete={() => setArticleDelete(article)}
                    />
                  );
                })}
                {!isHasMore && (
                  <div className="text-center text-gray-600 font-light">
                    No more articles
                  </div>
                )}
              </InfiniteScroll>
            </div>
          </div>
        )}
      </div>
      {articleDelete && (
        <ModalArticleDelete
          onCancel={() => setArticleDelete(undefined)}
          onConfirm={onDeleteArticle}
          name={articleDelete.title}
        />
      )}
    </div>
  );
};
