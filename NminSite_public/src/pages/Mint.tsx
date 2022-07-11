import React from "react";
import {
  Button,
  Box,
  Flex,
  Text,
  Image,
  Input,
  Link,
  Spacer,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { AppContext } from "../AppContext";
import { useFormik } from "formik";

import Facebook from "../assets/social-media-icons/facebook_32x32.png";
import Twitter from "../assets/social-media-icons/twitter_32x32.png";
import Email from "../assets/social-media-icons/email_32x32.png";

interface result {
  address: string;
  tokenId: number;
}

export default function Contract() {
  const appCtx = React.useContext(AppContext);

  const { authenticate, isAuthenticated, user, enableWeb3, logout, Moralis, web3 } = useMoralis();
  const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract({});

  const [bg, setBG] = React.useState<string>("");
  const [res, setRes] = React.useState<result>();
  const [showBGimage, setShowBGimage] = React.useState<boolean>(false);

  const init = async () => {
    await enableWeb3();
  };

  React.useEffect(() => {
    init();
  }, []);

  const formik = useFormik<any>({
    initialValues: {
      symbol: "TLK",
      coverURL: "https://i.imgur.com/tvTq6UB.gif",
    },
    onSubmit: async (values: any) => {
      setRes(undefined);

      runContractFunction({
        params: {
          abi: appCtx.contractABI,
          contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
          functionName: "newWebsite",
          params: { ...values },
        },
        onSuccess: async (tx: any) => {
          const response = await tx.wait();

          const { events } = response;
          events.map((event: any) => {
            if (event.event === "NewWebsite") {
              const { newAddress, owner, tokenId } = event.args;
              console.log({ newAddress, owner, tokenId });
              setRes({
                address: newAddress,
                tokenId,
              });
            }
          });
        },
        onError: async (err: any) => {
          console.log(err.message);
        },
      });
    },
  });

  React.useEffect(() => {
    setBG(`url("${formik.values["coverURL"]}")`);
  }, [formik]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex justify-between absolute top-0 left-0 right-0 space-x-4">
          <Text fontSize="2xl">Name: </Text>
          <Input
            width="125px"
            name="name"
            onChange={formik.handleChange}
            value={formik.values["name"]}
          />
          <Text fontSize="2xl">Symbol: </Text>
          <Input
            width="125px"
            name="symbol"
            onChange={formik.handleChange}
            value={formik.values["symbol"]}
          />
          <Text fontSize="2xl">Background Image: </Text>
          <Input
            width="400px"
            name="coverURL"
            onChange={formik.handleChange}
            value={formik.values["coverURL"]}
          />
          <Button colorScheme="blue" onClick={() => setShowBGimage(!showBGimage)}>
            {showBGimage ? "hidden" : "show"}
          </Button>

          <div className="flex-1" />
          {isFetching ? (
            <Spinner />
          ) : (
            <Button colorScheme="blue" type="submit">
              Mint Website
            </Button>
          )}

          {res && (
            <>
              <Text fontSize="2xl">
                <Link href={`/Contract/${res?.tokenId}`}> Go to your website</Link>
              </Text>
            </>
          )}
        </div>

        <div className="App">
          <Flex justify="space-between" align="center" padding="30px">
            <Flex justify="space-between" width="40%" padding="0 75px">
              <Link href="http://www.facebook.com">
                <Image src={Facebook} boxSize="42px" margin="0 15px" />
              </Link>

              <Link href="http://www.twitter.com">
                <Image src={Twitter} boxSize="42px" margin="0 15px" />
              </Link>

              <Link href="http://www.gmail.com">
                <Image src={Email} boxSize="42px" margin="0 15px" />
              </Link>
            </Flex>

            <Flex justify="space-around" align="center" width="40%" padding="30px">
              <Box margin="0 15px">About</Box>
              <Spacer />
              <Box margin="0 15px">Mint</Box>
              <Spacer />
              <Box margin="0 15px">Team</Box>
              <Spacer />

              {isAuthenticated ? (
                <Box margin="0 15px"> Connected</Box>
              ) : (
                <Button
                  backgroundColor="#D6517D"
                  borderRadius="5px"
                  boxShadow="0px 2px 2px 1px #0F0F0F"
                  color="white"
                  cursor="pointer"
                  fontFamily="inherit"
                  padding="15px"
                  margin="0 15px"
                  onClick={() => {}}
                >
                  Connect
                </Button>
              )}
            </Flex>
          </Flex>
          <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
            <Box width="520px">
              <div>
                <Input
                  height="60px"
                  placeholder={"title"}
                  name={"title"}
                  onChange={formik.handleChange}
                  value={formik.values["title"]}
                  fontSize="48px"
                  textShadow="0 5px #000000"
                  style={{ textAlign: "center" }}
                />

                <Textarea
                  placeholder="Here is a sample placeholder"
                  name={"content"}
                  onChange={formik.handleChange}
                  value={formik.values["content"]}
                  rows={8}
                  fontSize="30px"
                  letterSpacing="-5.5%"
                  fontFamily="VT323"
                  textShadow="0 2px 2px #000000"
                  resize="none"
                />
              </div>
            </Box>
            {isAuthenticated ? (
              <Flex>
                <Button
                  backgroundColor="#D6517D"
                  borderRadius="5px"
                  boxShadow="0px 2px 2px 1px #0F0F0F"
                  color="white"
                  cursor="pointer"
                  fontFamily="inherit"
                  padding="15px"
                  margin="10px"
                  onClick={() => {}}
                >
                  get {formik.values["symbol"]}
                </Button>
              </Flex>
            ) : (
              <p>connected first</p>
            )}
          </Flex>
        </div>
        {showBGimage && <div className="moving-background" style={{ backgroundImage: bg }}></div>}
      </form>
    </>
  );
}
