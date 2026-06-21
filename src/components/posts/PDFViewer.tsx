import React, { useMemo, useState } from 'react';
import { DrawerBody, DrawerContent, DrawerHeader, DrawerRoot } from '@/components/ui/drawer';
import { Box, HStack, IconButton, Text, Link, Collapsible, Progress, Spacer, Center, useBreakpointValue, Icon, Editable, EditablePreview, EditableInput } from '@chakra-ui/react';
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
      <DrawerRoot
        open={isOpen}
        onOpenChange={(e) => !e.open && (onClose)()}
        placement="bottom"
        size="full"
        allowPinchZoom
      >
        <DrawerContent top={0} bg="bg">
          <DrawerHeader shadow="xl" p={0}>
            <HStack align="center" w="100%" px={2} gap={2}>
              <IconButton
                aria-label="close"
                size="lg"
                variant="ghost"
                onClick={onClose}
                borderRadius="full"
              >{<Icon as={TbX} boxSize={6} />}</IconButton>
              <Text textStyle="title" whiteSpace="nowrap" lineClamp={1} py={4}>
                {attachment.name}
              </Text>
              <Spacer />
              <IconButton
                aria-label="open source link"
                size="lg"
                variant="ghost"
                borderRadius="full"
                asChild
              >
                <Link
                  href={attachment.url ?? ''}
                  target="_blank" rel="noreferrer"
                >
                  <Icon as={TbExternalLink} boxSize={6} />
                </Link>
              </IconButton>
            </HStack>
            <Box w="100%">
              <Collapsible.Root open={!!isFetching}><Collapsible.Content>
                <Progress w="100%" size="xs" isIndeterminate />
              </Collapsible.Content></Collapsible.Root>
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
      </DrawerRoot>
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
        gap={4}
        border="1px solid"
        borderColor="border"
      >
        <IconButton
          aria-label="Zoom out"
          rounded="lg"
          onClick={onZoomOut}
        >{<Icon boxSize={6} as={TbZoomOut} />}</IconButton>
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
        >{<Icon boxSize={6} as={TbZoomIn} />}</IconButton>
      </HStack>
    </Center>
  ),
);
ZoomControls.displayName = 'ZoomControls';

export default PDFViewer;
