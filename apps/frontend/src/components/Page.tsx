import React, { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { LoginModal } from "./LoginModal";
import { useAppDispatch, useAppSelector } from "~/app/hooks";
import { uiSlice } from "~/app/ui";
import { Toaster } from "react-hot-toast";
import { SideNav } from "./SideNav";
import Link from "./Link";
import { useAuth } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";

type Props = {
  sidebar?: React.ReactNode;
  content: React.ReactNode;
  activePage?: string;
};

export const Page = ({ sidebar, content, activePage }: Props) => {
  const { isSignedIn, userId } = useAuth();
  const modalShown = useAppSelector(
    (state) => state.ui.session.loginModalShown
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isSignedIn && !modalShown) {
      dispatch(uiSlice.actions.openLoginModal());
    } else if (isSignedIn) {
      dispatch(uiSlice.actions.closeLoginModal());
    }
  }, [dispatch, isSignedIn, modalShown]);

  const posthog = usePostHog();

  useEffect(() => {
    if (isSignedIn && userId) {
      posthog?.identify(userId);
    } else {
      posthog?.reset();
    }
  }, [posthog, isSignedIn, userId]);

  return (
    <div className="accent-blue-600 dark:accent-blue-800 flex flex-col md:h-screen min-h-screen">
      <LoginModal />
      <Toaster position="bottom-right" />
      <header className="sticky top-0 border-b drop-shadow bg-gray-50 border-gray-200 dark:bg-zinc-800 z-10">
        <Header />
      </header>
      <main className="relative flex flex-1 flex-col md:flex-row md:justify-around md:overflow-hidden">
        <SideNav activePage={activePage} />
        {sidebar && <Sidebar>{sidebar}</Sidebar>}
        <div
          className={`flex-1 overflow-y-auto md:h-full ${
            !sidebar ? "max-w-7xl" : ""
          }`}
        >
          {content}
        </div>
      </main>
      <footer className="border-t md:py-5 md:px-2 p-8 text-sm text-gray-500 bg-gray-50 border-gray-100">
        <div className="mx-auto max-w-4xl">
          <p>
            Designed, developed and maintained with ❤️ by{" "}
            <Link href="https://scottylabs.org">ScottyLabs</Link>.
          </p>
          <p>
            Want to help us make CMU Courses better? Join us at ScottyLabs or
            make a pull request on our{" "}
            <Link href="https://github.com/ScottyLabs/course-tool">
              GitHub repository
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};
