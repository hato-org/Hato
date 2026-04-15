import React, { useMemo, useState } from 'react';
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
  Spacer,
  Center,
  useBreakpointValue,
  Icon,
  Editable,
  EditablePreview,
  EditableInput,
} from '@chakra-ui/react';
import { useIsFetching } from '@tanstack/react-query';
import { TbExternalLink, TbX, TbZoomIn, TbZoomOut } from 'react-icons/tb';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Loading from '../common/Loading';
import Error from '../cards/Error';
import { usePostAttachment } from '@/services/posts';
import { queryKeys } from '@/services/queryKeys';

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment;
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PDFViewer = React.memo(
  ({ isOpen, onClose, attachment }: PDFViewerProps) => {
    const isFetching = useIsFetching({
      queryKey: queryKeys.posts.attachmentAll(),
    });
    const pdfWidth = useBreakpointValue({
      base: window.innerWidth,
      md: undefined,
    });
    const isZoomControlShow = useBreakpointValue({
      base: false,
      lg: true,
    });

    const { data, error, isPending } = usePostAttachment(attachment.id, {
      enabled: isOpen,
      staleTime: Infinity, // Infinity
      gcTime: Infinity, // Infinity
    });

    const pdfData = useMemo(
      () => (isOpen ? structuredClone(data) : undefined),
      [isOpen, data],
    );

    const [pageCount, setPageCount] = useState(0);
    const [zoom, setZoom] = useState(100);

    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
        size="full"
        allowPinchZoom
      >
        <DrawerOverlay />
        <DrawerContent top={0} bg="bg">
          <DrawerHeader shadow="xl" p={0}>
            <HStack align="center" w="100%" px={2} spacing={2}>
              <IconButton
                aria-label="close"
                icon={<Icon as={TbX} boxSize={6} />}
                size="lg"
                variant="ghost"
                onClick={onClose}
                isRound
              />
              <Text textStyle="title" whiteSpace="nowrap" noOfLines={1} py={4}>
                {attachment.name}
              </Text>
              <Spacer />
              <IconButton
                aria-label="open source link"
                icon={<Icon as={TbExternalLink} boxSize={6} />}
                size="lg"
                variant="ghost"
                as={Link}
                href={attachment.url ?? ''}
                isExternal
                isRound
              />
            </HStack>
            <Box w="100%">
              <Collapse in={!!isFetching}>
                <Progress w="100%" size="xs" isIndeterminate />
              </Collapse>
            </Box>
          </DrawerHeader>
          <DrawerBody p={0} position="relative" zIndex={-5}>
            <Center>
              {isPending ? (
                <Loading />
              ) : error ? (
                <Error error={error} />
              ) : (
                <Document
                  file={pdfData}
                  onLoadSuccess={(pdf) => {
                    setPageCount(pdf.numPages);
                  }}
                  loading={<Loading />}
                >
                  {Array.from(new Array(pageCount), (el, index) => (
                    <Center
                      key={`page_${index + 1}`}
                      py={2}
                      shadow="md"
                      maxW="100vw"
                      onDoubleClick={() => setZoom((z) => z + 20)}
                    >
                      <Page
                        scale={zoom * 0.01}
                        width={pdfWidth}
                        pageNumber={index + 1}
                        loading={<Loading />}
                      />
                    </Center>
                  ))}
                </Document>
              )}
            </Center>
            {isZoomControlShow && (
              <ZoomControls
                zoom={zoom}
                onZoomIn={() => setZoom((z) => z + 10)}
                onZoomOut={() => setZoom((z) => z - 10)}
                onSetZoom={(z) =>
                  /[^0-9]/.test(z) ? undefined : setZoom(Number(z))
                }
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  },
);
PDFViewer.displayName = 'PDFViewer';

const ZoomControls = React.memo(
  ({
    zoom,
    onZoomIn,
    onZoomOut,
    onSetZoom,
  }: {
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onSetZoom: (zoom: string) => void;
  }) => (
    <Center position="fixed" bottom={4} w="full" zIndex={3000}>
      <HStack
        bg="bgAlpha"
        backdropFilter="auto"
        backdropBlur="sm"
        px={2}
        py={2}
        rounded="xl"
        shadow="lg"
        spacing={4}
        border="1px solid"
        borderColor="border"
      >
        <IconButton
          aria-label="Zoom out"
          rounded="lg"
          onClick={onZoomOut}
          icon={<Icon boxSize={6} as={TbZoomOut} />}
        />
        <HStack textStyle="title">
          <Editable value={zoom.toString()} onChange={onSetZoom}>
            <EditablePreview />
            <EditableInput />
          </Editable>
          <Text>%</Text>
        </HStack>
        <IconButton
          aria-label="Zoom in"
          rounded="lg"
          onClick={onZoomIn}
          icon={<Icon boxSize={6} as={TbZoomIn} />}
        />
      </HStack>
    </Center>
  ),
);
ZoomControls.displayName = 'ZoomControls';

export default PDFViewer;
