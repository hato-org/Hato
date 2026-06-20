import React, { useState, useCallback } from 'react';
import { DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot } from '@/components/ui/drawer';
import { Box, Button, Center, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { TbPlus } from 'react-icons/tb';
import Card from '../layout/Card';
import { cards, cardOrderAtom } from '@/store/dashboard';
import { cardComponentMap } from '@/components/cards';
import { cardOrderDrawerAtom } from '@/store/overlay';

const AddCardDrawer = React.memo(() => {
  const [cardOrderDrawer, setCardOrderDrawer] = useAtom(cardOrderDrawerAtom);
  const [cardOrder, setCardOrder] = useAtom(cardOrderAtom);
  const [selectedCard, setSelectedCard] = useState('');

  const unlistedCards = cards.filter((card) => !cardOrder.includes(card.id));

  const onClose = useCallback(
    () => setCardOrderDrawer(false),
    [setCardOrderDrawer],
  );

  return (
    <DrawerRoot placement="bottom" open={cardOrderDrawer} onOpenChange={(e) => !e.open && (onClose)()}>
      <DrawerContent bg="panel" roundedTop="xl">
        <DrawerHeader w="full" maxW="container.lg" mx="auto">
          カードの追加
        </DrawerHeader>
        <DrawerBody w="full" maxW="container.lg" mx="auto">
          <Flex
            w="full"
            overflowX="auto"
            sx={{ scrollSnapType: 'x mandatory' }}
          >
            {unlistedCards.length ? (
              unlistedCards.map((card) => (
                <VStack
                  key={card.id}
                  scrollSnapAlign="center"
                  alignContent="stretch"
                  minW="full"
                  pb={8}
                >
                  <Text textStyle="title" fontSize="xl">
                    {card.name}
                  </Text>
                  <Text
                    px={4}
                    textAlign="center"
                    textStyle="description"
                    whiteSpace="pre-wrap"
                  >
                    {card.description}
                  </Text>
                  <Flex w="full" h="full" justify="center" align="center">
                    <Card
                      borderWidth={selectedCard === card.id ? 1 : 1}
                      borderColor={
                        selectedCard === card.id ? 'border-accent' : 'border'
                      }
                      bg={selectedCard === card.id ? 'accent' : 'panel'}
                      pos="relative"
                      w="full"
                      transform="scale(0.8)"
                    >
                      {(() => {
                        const CardComponent = cardComponentMap[card.id];
                        return CardComponent ? <CardComponent /> : null;
                      })()}
                      <Box
                        pos="absolute"
                        inset={0}
                        onClick={() => setSelectedCard(card.id)}
                      />
                    </Card>
                  </Flex>
                </VStack>
              ))
            ) : (
              <Center w="full">
                <Text textStyle="description" fontWeight="bold">
                  追加できるカードがありません
                </Text>
              </Center>
            )}
          </Flex>
        </DrawerBody>
        <DrawerFooter
          pb="env(safe-area-inset-bottom)"
          w="full"
          maxW="container.lg"
          mx="auto"
        >
          <Button
            w="full"
            rounded="lg"
            colorScheme="blue"
            disabled={!selectedCard}
            onClick={() => {
              setCardOrder((currVal) => [...currVal, selectedCard]);
              setSelectedCard('');
              onClose();
            }}
          >{<Icon as={TbPlus} />} 
            カードを追加
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
});
AddCardDrawer.displayName = 'AddCardDrawer';

export default AddCardDrawer;
