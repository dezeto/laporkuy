import { PropsWithChildren } from "react";
import { VStack, Container, Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const HeaderDynamic = dynamic(import("./Navbar"), {
  ssr: false,
});
const FooterDynamic = dynamic(import("./Footer"), {
  ssr: false,
});
const ToTopDynamic = dynamic(import("./ToTop"), {
  ssr: false,
});

type Props = PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
  return (
    <Container
      display="flex"
      maxW="8xl"
      minH="100vh"
      px={{ base: 4, md: 8 }}
      centerContent
    >
      <VStack flex={1} spacing={16} alignItems="stretch" w="full">
        <HeaderDynamic />
        <Box flex={1} w="full" as="section">
          <VStack spacing={16} min-w="full" min-h="full">
            {children}
          </VStack>
        </Box>
        <FooterDynamic />
      </VStack>
      <ToTopDynamic />
    </Container>
  );
};

export default Layout;
