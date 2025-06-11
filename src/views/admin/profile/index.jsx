// Chakra imports
import { Box, Grid, Center, Text } from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/profile/components/Banner";
import General from "views/admin/profile/components/General";
import Defect from "views/admin/profile/components/Defect";
import Notifications from "views/admin/profile/components/Notifications";
import Projects from "views/admin/profile/components/Projects";
import { useEffect, useState } from "react";
import axios from "axios";
// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React from "react";

export default function Overview() {
  const [userResponse, setUserResponse] = useState(null);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const username = userData.username
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/issuecountbyUser/${username}`)
      .then((res) => {
        setUserResponse(res.data[0]); // assuming response is always an array with one object
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, []);
  if (!userResponse) {
    return (
      <Center h="200px">
        <Text fontSize="lg" color="gray.500">
          User not found.
        </Text>
      </Center>
    );
  }
  return (

    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr", // 1 column on small screens
          lg: "1.34fr 1fr 1.62fr", // three columns on larger screens
        }}
        templateRows={{
          base: "repeat(3, 1fr)", // 3 rows on small screens
          lg: "1fr", // 1 row on larger screens
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Banner
          gridArea="1 / 1 / 2 / 2"
          banner={banner}
          avatar={avatar}
          name={userResponse.username || "User"}
          // job="Software Developer"
          bugCount={userResponse.bugCount}
          crCount={userResponse.crCount}
        />
        <Defect
          gridArea={{ base: "2 / 1 / 3 / 3", lg: "1 / 2 / 2 / 4" }}
          minH={{ base: "auto", lg: "180px", "2xl": "300px" }}
          pe="20px"
          pb={{ base: "100px", lg: "20px" }}
        />
      </Grid>

      {/* Second Grid for Projects */}
      <Grid
        mb="20px"
        templateColumns={{
          base: "1fr", // 1 column on small screens
          lg: "repeat(2, 1fr)", // 2 columns on large screens
          "2xl": "1fr 1.62fr 1fr", // 3 columns on xl screens
        }}
        templateRows={{
          base: "1fr", // 1 row on small screens
          lg: "repeat(2, 1fr)", // 2 rows on larger screens
          "2xl": "1fr", // 1 row on xl screens
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Projects
          gridColumn={{ base: "1 / -1", lg: "1 / 3", "2xl": "1 / 4" }} // Span full width on base and larger screens
        />
      </Grid>
    </Box>
  );

}
{/* <General
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          minH='365px'
          pe='20px'
        /> */}
{/* <Notifications
          used={25.6}
          total={50}
          gridArea={{
            base: "3 / 1 / 4 / 2",
            lg: "2 / 1 / 3 / 3",
            "2xl": "1 / 3 / 2 / 4",
          }}
        /> */}