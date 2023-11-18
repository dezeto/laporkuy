import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import {
  Box,
  InputGroup,
  InputRightElement,
  Input,
  Text,
  Avatar,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Stack,
  Button,
  CircularProgress,
} from "@chakra-ui/react";
import { IoCamera } from "react-icons/io5";
import { ChangeEvent, useRef, useState } from "react";
import { SearchResult } from "~/server/api/response/face";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const [search, setSearch] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFraudster, setSelectedFraudster] =
    useState<SearchResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const toast = useToast();
  const router = useRouter();

  const handlePhotoClick = () => {
    inputFileRef.current?.click();
  };

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

  const searchFace = api.face.search.useMutation({
    onSuccess: () => {},
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = e.target.files?.[0];
    setSearch(file?.name || "");
    if (!file) {
      return;
    }
    try {
      const image = await readAsDataURL(file);
      setUploadedImage(image);
      const result = await searchFace.mutateAsync({ image });
      setSearchResult(result && result.length > 0 ? result : []);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return toast({
        title: "Error",
        description: "Please try to upload another image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>LaporKuy.</title>
        <meta name="description" content="Laporkuyy!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${
          searchResult.length > 0 ? "mt-0" : "mt-52"
        } relative flex min-h-full min-w-full flex-col items-center justify-center transition-all duration-500 ease-in-out`}
      >
        <Box className="w-1/2">
          <InputGroup>
            <InputRightElement
              className="cursor-pointer"
              onClick={handlePhotoClick}
              children={
                isLoading ? (
                  <CircularProgress isIndeterminate size={5} />
                ) : (
                  <IoCamera />
                )
              }
            />
            <Input
              placeholder="Search Fraudster Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={inputFileRef}
              onChange={handleFileChange}
            />
          </InputGroup>
        </Box>
        <Popover>
          <PopoverTrigger>
            <Box className="mt-28 flex items-center justify-center gap-8">
              {searchResult.length > 0 &&
                searchResult.map((result) => {
                  return (
                    <Box
                      className="flex cursor-pointer flex-col gap-3 rounded-lg border-2 p-5 text-center"
                      onClick={() => setSelectedFraudster(result)}
                    >
                      <Avatar src={result.image} size="2xl" />
                      <Text className="text-lg">{result.name}</Text>
                      <Text className="text-lg">
                        Similarity: {result.similarity.toFixed(1)}
                      </Text>
                    </Box>
                  );
                })}
            </Box>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <Stack>
                <Box className="w-full">
                  <Button
                    className="w-full"
                    onClick={() =>
                      router.push({
                        pathname: `/posts/${selectedFraudster?.id}`,
                      })
                    }
                  >
                    View post
                  </Button>
                </Box>
                <Box className="w-full">
                  <Button
                    className="w-full"
                    onClick={() =>
                      router.push({
                        pathname: `/lapor/${selectedFraudster?.postId}`,
                      })
                    }
                  >
                    Create new related post
                  </Button>
                </Box>
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </main>

    <footer>
    </footer>
    </>
  );
};

export default Home;
