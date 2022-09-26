import { Box, BoxProps, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Helmet, HelmetTags } from 'react-helmet-async';

// NOTE: This code is written by David Chen, in https://github.com/HolodexNet/Musicdex licensed under Apache 2.0 License.
// NOTE: Modified by P_man2976

const googleUrl = 'https://accounts.google.com/gsi/client';
const CLIENT_ID =
  '933844444976-d5n9lrv65rr50l2v5q42cqmkcmsl13ej.apps.googleusercontent.com';

interface GoogleButtonParams extends BoxProps {
  onCredentialResponse: (response: GoogleCredentialResponse) => void;
}

function LoginButton({ onCredentialResponse, ...rest }: GoogleButtonParams) {
  const [scriptLoaded, setScriptLoaded] = useState(
    typeof window !== 'undefined' &&
      typeof (window as any).google !== 'undefined'
  );
  const divRef = React.createRef<HTMLDivElement>();

  // Helmet does not support the onLoad property of the script tag, so we have to manually add it like so
  const handleChangeClientState = (newState: any, addedTags: HelmetTags) => {
    if (addedTags && addedTags.scriptTags) {
      const foundScript = addedTags.scriptTags.find(
        ({ src }) => src === googleUrl
      );
      if (foundScript) {
        foundScript.addEventListener('load', () => setScriptLoaded(true), {
          once: true,
        });
      }
    }
  };

  useEffect(() => {
    if (scriptLoaded && divRef.current) {
      (window as any).google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: onCredentialResponse,
      });
      (window as any).google.accounts.id.renderButton(divRef.current, {
        theme: 'outline',
        size: 'large',
        width: divRef.current.clientWidth,
      });
      // (window as any).google.accounts.id.prompt();
    }
  }, [scriptLoaded, divRef, onCredentialResponse]);

  return (
    <>
      <Helmet onChangeClientState={handleChangeClientState}>
        <script src={googleUrl} async defer />
      </Helmet>
      {scriptLoaded ? (
        <Box
          ref={divRef}
          // height={"32px"}
          // bgColor="white"
          // rounded="lg"
          overflow="hidden"
          {...rest}
        />
      ) : (
        <Box>
          <Text fontWeight="bold" fontSize="sm">
            読み込んでいます…
          </Text>
        </Box>
      )}
    </>
  );
}

export default LoginButton;
