import {
  GetServerSideProps,
  GetServerSidePropsResult,
  type NextPage,
} from "next";
import { getSession } from "next-auth/react";

import React, { useState } from "react";
import Webcam from "react-webcam";

import { Text, Button, useToast } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface CameraProps {
  onCapture: (data: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const [image, setImage] = useState<string | null>(null);
  const webcamRef = React.useRef<Webcam & HTMLVideoElement>(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  return (
    <div className="w-max">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored
      />
      <Button className="my-3 w-full" onClick={capture}>
        Capture photo
      </Button>
      {image && <img src={image} alt="captured image" />}
    </div>
  );
};

const Verify: NextPage<Session> = (session: Session) => {
  const { user } = session;
  const toast = useToast();
  const [imageData, setImageData] = useState<string | null>(null);
  const router = useRouter();
  const verifyMutation = api.face.enrollUser.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your identity has been verified",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/");
    },
    onError: (error) => {
      return toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  }).mutate;

  const handleVerify = () => {
    verifyMutation({ image: imageData as string });
  };

  const handleCapture = (data: string) => {
    setImageData(data);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Text className="text-center">Verify your identity</Text>
      <Camera onCapture={handleCapture} />
      <Button
        className="my-3 px-5"
        disabled={!imageData}
        onClick={handleVerify}
      >
        Verify Photo
      </Button>
    </div>
  );
};

export default Verify;

export const getServerSideProps: GetServerSideProps<Session> = async (
  context
): Promise<GetServerSidePropsResult<Session>> => {
  const session = await getSession(context);

  if (!session || !session.user || session.user.enrolled) {
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
