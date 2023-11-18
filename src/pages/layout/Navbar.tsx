import {
  HStack,
  Heading,
  IconButton,
  useColorMode,
  Button,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Stack,
  Box,
} from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import NextLink from "next/link";
import { FaUserAlt } from "react-icons/fa";
import { IoMoon, IoSunny } from "react-icons/io5";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: sessionData } = useSession();

  return (
    <HStack as="nav" justifyContent="space-between" alignItems="center" py={3}>
      <NextLink href="/" passHref>
        <Link _focus={{ outline: "none" }}>
          <Heading size="sm">LaporKuy.</Heading>
        </Link>
      </NextLink>
      <HStack alignItems="center" spacing={{ base: 0, md: 2 }}>
        <IconButton
          aria-label="toggle theme"
          icon={colorMode === "light" ? <IoMoon /> : <IoSunny />}
          variant="ghost"
          size="sm"
          onClick={toggleColorMode}
        />
        <Popover>
          <PopoverTrigger>
            <IconButton
              aria-label="toggle theme"
              icon={<FaUserAlt />}
              variant="ghost"
              size="sm"
            />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>
              Welcome, {sessionData?.user.name || "Guest"}
            </PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
              <Stack>
                <NextLink href="/lapor" passHref>
                  <Link _focus={{ outline: "none" }}>
                    <Box className="w-full">
                      <Button className="w-full">Lapor Now</Button>
                    </Box>
                  </Link>
                </NextLink>
                {sessionData && !sessionData?.user.enrolled && (
                  <NextLink href="/verify" passHref>
                    <Link _focus={{ outline: "none" }}>
                      <Box className="w-full">
                        <Button className="w-full">Verify Now</Button>
                      </Box>
                    </Link>
                  </NextLink>
                )}
                <Box className="w-full">
                  <Button
                    className="w-full"
                    onClick={
                      sessionData ? () => void signOut() : () => void signIn()
                    }
                  >
                    {sessionData ? "Logout" : "Login / Register"}
                  </Button>
                </Box>
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
    </HStack>
  );
};

export default Header;
