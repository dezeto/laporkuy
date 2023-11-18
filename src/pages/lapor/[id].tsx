import {
  GetServerSideProps,
  GetServerSidePropsResult,
  type NextPage,
} from "next";
import { getSession } from "next-auth/react";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Textarea,
  useToast,
  useBreakpointValue,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { useState, useMemo } from "react";

import { api } from "~/utils/api";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import TagsInput from "~/components/TagInput";

const Lapor: NextPage<Session> = (session: Session) => {
  const { user } = session;
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState<FileList | null>(null);
  const [evidence, setEvidence] = useState<FileList | null>(null);
  const [bankNumber, setBankNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const colSpan = useBreakpointValue({ base: 2, md: 1 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const readAsDataURL = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const generateUUID = () => {
    var d = new Date().getTime();
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  };

  const createFraudsterAndPost = api.shared.createPostAndFraudster.useMutation({
    onSuccess: () => {},
  });

  const uploadImages = api.image.uploadImages.useMutation({
    onSuccess: () => {},
  });

  const enrollFraud = api.face.enrollFrauster.useMutation({
    onSuccess: () => {},
  });

  const laporNow = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setIsLoading(true);

    const image_b64 = await readAsDataURL(image?.[0] as File);
    const imageUrl = await uploadImages.mutateAsync({
      images: [image_b64] as unknown as string[],
    });

    const evidence_b64 = await readAsDataURL(evidence?.[0] as File);
    const evidenceUrl = await uploadImages.mutateAsync({
      images: [evidence_b64] as unknown as string[],
    });
    const fraudId = generateUUID();

    await enrollFraud.mutateAsync({
      id: fraudId,
      image: image_b64,
    });

    await createFraudsterAndPost.mutateAsync({
      post: {
        title,
        description,
        photos: evidenceUrl,
        label: tags,
        relatedPostId: (id as string) || undefined,
        happennedAt: date,
      },
      fraudster: {
        id: fraudId,
        name: name,
        photo: imageUrl[0] as string,
        address,
        bankAccount: bankNumber,
        phoneNumber,
      },
    });

    toast({
      title: "Success",
      description: "Success to create a fraud post",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setIsLoading(false);
    router.push("/");
  };

  const changeHandler = (value: string[]) => {
    if (value) setTags(value);
  };

  const ShowImage = () => {
    let imageFile: string = "";
    if (image && image.length > 0) {
      imageFile = window.URL.createObjectURL(image[0] as Blob);
    }
    if (!imageFile) return <></>;

    return (
      <Image
        src={imageFile}
        alt="img preview"
        border="1px solid gray"
        rounded="lg"
        objectFit="cover"
        maxH="300px"
        mb="3"
      />
    );
  };

  const CachedImage = useMemo(
    () => (
      <Box maxH="500px" pos="relative">
        <ShowImage />
      </Box>
    ),
    [image]
  );

  const ShowEvidence = () => {
    let imageFile: string = "";
    if (evidence && evidence.length > 0) {
      imageFile = window.URL.createObjectURL(evidence[0] as Blob);
    }
    if (!imageFile) return <></>;

    return (
      <Image
        src={imageFile}
        alt="img preview"
        border="1px solid gray"
        rounded="lg"
        objectFit="cover"
        maxH="300px"
        mb="3"
      />
    );
  };

  const CachedEvidence = useMemo(
    () => (
      <Box maxH="500px" pos="relative">
        <ShowEvidence />
      </Box>
    ),
    [evidence]
  );

  return (
    <main className="relative mt-5 flex min-h-full min-w-full flex-col items-center justify-center transition-all duration-500 ease-in-out">
      <Box w="full">
        <Box w="full">
          <Heading size="lg" pb="3">
            Laporinn!! 📢
          </Heading>
          <Flex
            direction={{ base: "column", md: "row" }}
            p={{ base: "4", md: "7" }}
            rounded="md"
            boxShadow={useColorModeValue(
              "lg",
              "rgba(252, 252, 252, 0.25) 0px 0px 5px 1px, rgba(255, 255, 255, 0.1) 0px 0px 1px 0px"
            )}
          >
            <Box as="form" w="100%" onSubmit={laporNow}>
              <SimpleGrid columns={2} columnGap={3} rowGap={4} w="full">
                <GridItem colSpan={colSpan}>
                  <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input
                      name="title"
                      placeholder="Title"
                      type="text"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={colSpan}>
                  <FormControl>
                    <FormLabel>Happened at</FormLabel>
                    <SingleDatepicker
                      name="date"
                      date={date}
                      onDateChange={setDate}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Fraudster Image</FormLabel>
                    <Box maxH="500px" pos="relative">
                      {CachedImage}
                    </Box>
                    <FormLabel
                      m="0"
                      htmlFor="image"
                      border="1px solid slategray"
                      borderRadius="lg"
                      p="3"
                      cursor="pointer"
                    >
                      <AiOutlinePlus className="mx-auto" />
                    </FormLabel>
                    <Input
                      name="image"
                      id="image"
                      type="file"
                      accept="image/*"
                      display="none"
                      w="1"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setImage(e.target.files);
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Evidence</FormLabel>
                    <Box maxH="500px" pos="relative">
                      {CachedEvidence}
                    </Box>
                    <FormLabel
                      m="0"
                      htmlFor="evidence"
                      border="1px solid slategray"
                      borderRadius="lg"
                      p="3"
                      cursor="pointer"
                    >
                      <AiOutlinePlus className="mx-auto" />
                    </FormLabel>
                    <Input
                      name="evidence"
                      id="evidence"
                      type="file"
                      accept="image/*"
                      display="none"
                      w="1"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setEvidence(e.target.files);
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Fraudster Name</FormLabel>
                    <Input
                      name="name"
                      placeholder="Name"
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={colSpan}>
                  <FormControl>
                    <FormLabel>Bank Number</FormLabel>
                    <Input
                      name="bankNumber"
                      placeholder="Bank Number"
                      type="text"
                      onChange={(e) => setBankNumber(e.target.value)}
                      value={bankNumber}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={colSpan}>
                  <FormControl>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phoneNumber"
                      placeholder="Phone Number"
                      type="text"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      value={phoneNumber}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      name="description"
                      placeholder="Description"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Textarea
                      name="address"
                      placeholder="Address"
                      onChange={(e) => setAddress(e.target.value)}
                      value={address}
                    />
                  </FormControl>
                </GridItem>
                <Flex w="full" flex={1} alignItems="flex-end">
                  <Text fontSize="2xl" fontWeight="semibold" mb="2" mr="2">
                    Tags:
                  </Text>
                  <TagsInput
                    placeholder="Add tags.."
                    onChange={changeHandler}
                    defaultTags={tags}
                  />
                </Flex>
                <GridItem
                  colSpan={2}
                  display="flex"
                  alignItems="center"
                  w="full"
                >
                  <Button w="full" type="submit" isLoading={isLoading}>
                    Lapor
                  </Button>
                </GridItem>
              </SimpleGrid>
            </Box>
          </Flex>
        </Box>
      </Box>
    </main>
  );
};

export default Lapor;

export const getServerSideProps: GetServerSideProps<Session> = async (
  context
): Promise<GetServerSidePropsResult<Session>> => {
  const session = await getSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { user, expires } = session;
  return {
    props: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        enrolled: user?.enrolled ? true : false,
      },
      expires: expires,
    },
  };
};
