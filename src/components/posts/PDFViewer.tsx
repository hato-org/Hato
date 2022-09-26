import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Text,
  Link,
  Collapse,
  Progress,
  chakra,
  Spacer,
} from '@chakra-ui/react';
import { useQuery, useIsFetching } from '@tanstack/react-query';
import { Document, Page, pdfjs } from 'react-pdf';
import React, { useState } from 'react';
import { TbExternalLink, TbX } from 'react-icons/tb';
import { AxiosError } from 'axios';
import { useClient } from '../../modules/client';
import Loading from '../common/Loading';
import Error from '../cards/Error';
// import pdfworker from './pdf.worker.min.js?url';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = pdfworker;

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment;
}

const ChakraDocument = chakra(Document);
const ChakraPage = chakra(Page);

const PDFViewer = React.memo(
  ({ isOpen, onClose, attachment }: PDFViewerProps) => {
    const { client } = useClient();
    const isFetching = useIsFetching();

    const { data, error, isLoading } = useQuery<ArrayBuffer, AxiosError>(
      ['post', 'attachment', attachment.id],
      async () =>
        (
          await client.get(`/post/attachment/${attachment.id}`, {
            // params: {
            //   base64: true,
            // },
            responseType: 'arraybuffer',
          })
        ).data,
      {
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        cacheTime: Infinity, // Infinity
      }
    );

    const [pageCount, setPageCount] = useState(0);

    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
        size="full"
        allowPinchZoom
      >
        <DrawerOverlay />
        <DrawerContent top={0}>
          <DrawerHeader shadow="xl">
            <HStack w="100%" spacing={1}>
              <Text textStyle="title" noOfLines={1}>
                {attachment.name}
              </Text>
              <Spacer />
              <IconButton
                aria-label="open source link"
                icon={<TbExternalLink />}
                variant="ghost"
                as={Link}
                href={attachment.url ?? ''}
                isExternal
                isRound
              />
              <IconButton
                aria-label="close"
                icon={<TbX />}
                variant="ghost"
                onClick={onClose}
                isRound
              />
            </HStack>
            <Box w="100%">
              <Collapse in={!!isFetching}>
                <Progress w="100%" size="xs" isIndeterminate />
              </Collapse>
            </Box>
          </DrawerHeader>
          <DrawerBody>
            <Box w="100%" py={4}>
              {/* eslint-disable no-nested-ternary */}
              {isLoading ? (
                <Loading />
              ) : error ? (
                <Error error={error} />
              ) : (
                <ChakraDocument
                  w="100%"
                  file={{
                    // url: `/api/post/attachment/${attachment.id}`,
                    // httpHeaders: {
                    // 	"X-APIKEY": user?.apiKey,
                    // },
                    data,
                  }}
                  onLoadSuccess={(pdf) => {
                    setPageCount(pdf.numPages);
                  }}
                  loading={<Loading />}
                  // renderMode="svg"
                >
                  {Array.from(new Array(pageCount), (el, index) => (
                    <ChakraPage
                      zIndex={-5}
                      px="auto"
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      loading={<Loading />}
                    />
                  ))}
                </ChakraDocument>
              )}
              {/* eslint-enable no-nested-ternary */}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }
);

export default PDFViewer;
