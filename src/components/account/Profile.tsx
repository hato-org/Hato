import {
  HStack,
  Avatar,
  VStack,
  StackDivider,
  Text,
  Spacer,
} from '@chakra-ui/react';
import html2canvas from 'html2canvas';
import { useUser } from '@/hooks/user';
import { useClassList, useCourseList, useGradeList } from '@/hooks/info';

function Profile() {
  const { data: user } = useUser();
  const { data: courseList } = useCourseList({
    type: user.type,
    grade: user.grade,
  });

  const { data: gradeList } = useGradeList();
  const { data: classList } = useClassList({
    type: user.type,
    grade: user.grade,
  });

  const downloadProfile = async () => {
    const target = document.getElementById('profile-image');
    const canvas = await html2canvas(target!);
    canvas.toBlob((blob) => {
      const blobURL = URL.createObjectURL(blob!);
      window.open(blobURL);
    }, 'img/png');
    // const image = new Image();
    // image.src = canvas.toDataURL();
    // const imageWindow = window.open(canvas.toDataURL('image/png'), '_blank');
    // imageWindow?.document.write(image.outerHTML)
  };

  return (
    <HStack
      w="100%"
      justify="center"
      spacing={4}
      divider={<StackDivider borderColor="blue.300" borderWidth={1} />}
      p={4}
      rounded="xl"
      id="profile-image"
      onClick={async () => {
        await downloadProfile();
      }}
      // border="1px solid"
      // borderColor="gray.100"
      // shadow="xl"
    >
      <Avatar src={user?.avatar} size="lg" />
      <VStack align="flex-start" spacing={0}>
        <HStack w="100%">
          <Text textStyle="title" fontSize="xl">
            {user?.name}
          </Text>
          <Spacer />
          <Text fontSize="sm" color="gray.500" fontWeight="bold">
            {user?.contributionCount} pt
          </Text>
        </HStack>
        <Text color="gray.400" fontSize="xs">
          {user?.email}
        </Text>
        <HStack w="100%" align="flex-end">
          <Text fontWeight="bold">
            {
              gradeList?.find(
                (gradeInfo) =>
                  gradeInfo.type === user.type &&
                  gradeInfo.gradeCode === user.grade
              )?.shortName
            }
            -
            {
              classList?.find(
                (classInfo) =>
                  classInfo.type === user.type &&
                  classInfo.gradeCode === user.class
              )?.shortName
            }
          </Text>
          <Text fontWeight="bold">
            {courseList?.find((course) => user?.course === course.code)?.name}
          </Text>
          <Spacer />
          {/* <Text fontSize="xs" color="gray.500" fontWeight="bold">
              {user?.contributionCount} pt
            </Text> */}
        </HStack>
      </VStack>
    </HStack>
  );
}

export default Profile;
