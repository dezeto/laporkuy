import { type NextPage } from "next";
import { api } from "~/utils/api";

// testing
import {
  Box,
  InputGroup,
  InputRightElement,
  Input,
  Image,
  Flex,
  Spacer,
  Heading,
  Badge,
  Center,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  CardHeader,
  Card,
  CardBody,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { APP_CLIENT_INTERNALS } from "next/dist/shared/lib/constants";

const DetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  let fraudster: any;

  fraudster = api.post.getPostAndFraudsterBySubjectId.useQuery({
    subjectId: id as string,
  });

  const relatedPosts = api.post.getRelatedPostsById.useQuery({
    postId: fraudster?.data?.post?.id,
  });

  return (
    <>
      <Flex boxSize="l" justifyContent={"space-around"}>
        <Box boxSize="sm">
          <VStack>
            <Image
              src={fraudster?.data?.photo}
              boxSize="300px"
              objectFit="cover"
              alt="fraudster"
              fallbackSrc="https://via.placeholder.com/150"
            />
            <Box>
              <Heading>Evidence</Heading>
              <Image
                src={fraudster?.data?.post.photos[0]}
                boxSize="200px"
                objectFit="cover"
                alt="fraudster"
                fallbackSrc="https://via.placeholder.com/150"
              />
            </Box>
          </VStack>
        </Box>
        <Box boxSize="m">
          <Flex gap={6}>
            <Center>
              <Heading>{fraudster?.data?.post.title}</Heading>
            </Center>
            <Center>
              {fraudster?.data?.post.label.map((label) => (
                <Badge marginRight={2}>{label}</Badge>
              ))}
            </Center>
          </Flex>
          <VStack spacing={3} align="stretch" marginY={2}>
            <Box>
              <b>Name: </b>
              {fraudster?.data?.name}
            </Box>
            <Box>
              <b>Bank Account:</b> {fraudster?.data?.bankAccount}
            </Box>
            <Box>
              <b>Phone Number:</b> {fraudster?.data?.phoneNumber}
            </Box>
            <Box>
              <b>Address: </b>
              {fraudster?.data?.address}
            </Box>
            <Box>
              <b>Happened At:</b> {fraudster?.data?.post.happened_at.toString()}
            </Box>
          </VStack>
          <Box>
            <Tabs colorScheme={"black"}>
              <TabList>
                <Tab>Chronology</Tab>
                <Tab>
                  Related Report
                  <Badge ml="1" fontSize="0.8em" colorScheme="blue">
                    {relatedPosts?.data?.length}
                  </Badge>
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <p>{fraudster?.data?.post.description}</p>
                </TabPanel>
                <TabPanel>
                  <Stack spacing="3">
                    {relatedPosts?.data?.map((post) => (
                      <Card
                        key={"sm"}
                        size={"sm"}
                        onClick={() => router.push(`/posts/${post.id}`)}
                      >
                        <CardHeader>
                          <Flex rowGap={4}>
                            <Heading size="md">{post?.title}</Heading>
                            {post?.id === fraudster?.data?.post.id && (
                              <Center>
                                <Badge
                                  ml="1"
                                  fontSize="0.8em"
                                  colorScheme="blue"
                                >
                                  Current
                                </Badge>
                              </Center>
                            )}
                          </Flex>
                        </CardHeader>
                        <CardBody>
                          <Text>{post?.happened_at.toString()}</Text>
                        </CardBody>
                      </Card>
                    ))}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default DetailPage;
