import { Box } from "@chakra-ui/react";
import { env } from "~/env.mjs";

const Footer = () => {
  return (
    <Box pb={8} as="footer" textAlign="center">
      <small>
        &copy; Copyright {new Date().getFullYear()},{" "}
        <a
          href={`${process.env.NEXTAUTH_URL}/`}
          target="_blank"
          rel="noreferrer"
        >
          Laporkuy
        </a>
      </small>
    </Box>
  );
};

export default Footer;
