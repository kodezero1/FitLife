import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import smoothscroll from "smoothscroll-polyfill";

import { UserStoreProvider } from "../store";
import { ThemeStoreProvider } from "../components/Themes/useThemeState";
import { GlobalStyles } from "../components/GlobalStyles";
import Layout from "../components/Layout";


const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserStoreProvider>
        <ThemeStoreProvider>
          <GlobalStyles />
          <Analytics />

          <Layout>
            <Component pageProps={pageProps} />
          </Layout>
        </ThemeStoreProvider>
      </UserStoreProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
    </QueryClientProvider>
  );
};

export default MyApp;
