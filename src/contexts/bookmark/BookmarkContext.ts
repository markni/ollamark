import { createContext } from "react";
import { BookmarkContextType } from "./types";

export const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);
