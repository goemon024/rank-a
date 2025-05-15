"use client";

import styles from "./home.module.css";
import { Header } from "@/app/components/Header/Header";
import { QuestionArea } from "../components/QuestionArea/QuestionArea";
import SorterFilter from "../components/SorterFilter/SorterFilter";
import { Pagination } from "../components/pagination/pagination";
import PostButton from "../components/Button/PostButton";
import { LINKS_HOME } from "@/constants";
import { Footer } from "../components/Footer/Footer";
import { QuestionWithUserAndTags, Bookmark } from "@/types";

interface HomeProps {
  questions: QuestionWithUserAndTags[];
  currentPage: number;
  totalPages: number;
  keyword: string;
  userbookmarks?: Bookmark[];
}

export default function Home({
  questions,
  currentPage,
  totalPages,
  keyword,
}: HomeProps) {
  return (
    <div>
      <div>
        <Header links={LINKS_HOME} />
      </div>
      <div className={styles.main}>
        <div className={styles.questionArea}>
          <QuestionArea questions={questions} />
        </div>
        <div className={styles.filterSorter}>
          <SorterFilter />
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        keyword={keyword}
      />
      <div>
        <PostButton />
      </div>
      <Footer />
    </div>
  );
}
