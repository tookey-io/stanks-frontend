import { observer } from 'mobx-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { AuthTokensRequestDto } from '../../dto/auth/tokens.dto';
import { useStores } from '../../stores';

const AuthTwitterPage = observer(function () {
  const { twitterUserStore, authStore } = useStores();
  const router = useRouter();

  useEffect(() => {
    async function processCallback() {
      if (router.query.state && router.query.code) {
        const data: AuthTokensRequestDto = {
          state: router.query.state as string,
          code: router.query.code as string,
        };
        const tokens = await twitterUserStore.getAuthTokens(data);
        if (tokens.access.token) {
          authStore.saveToken(tokens.access.token);
          const user = await twitterUserStore.getUserProfile();
          twitterUserStore.setUser(user);
          router.push('/auth');
        }
      }
    }

    processCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return <>Loading...</>;
});

export default AuthTwitterPage;
