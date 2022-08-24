import { TableContainer, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import { CardElement } from "../cards";
import Loading from "../common/Loading";

interface TimetableTableProps {
	data?: CurrentTimetable;
  isLoading?: boolean;
  error?: any;
}

const TimetableTable = ({ data, isLoading, error }: TimetableTableProps) => {

  if (isLoading) return <Loading />
  if (error) return <CardElement.Error error={error} />

	return (
    <TableContainer w="100%">
      <Table variant="simple" size="sm" textStyle="title">
        <Thead>
          <Tr>
            <Th>時間</Th>
            <Th>教科</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.past.map((subj, index) => (
            <Tr key={`${index}-${subj.name}`}>
              <Td color="gray.300">{index + 1}</Td>
              <Td color="gray.300">{subj.name}</Td>
            </Tr>
          ))}
          {data?.now && (
            <Tr bg="blue.50">
              <Td color="blue.400">{data.past.length + 1}</Td>
              <Td color="blue.400">{data.now.name}</Td>
            </Tr>
          )}
          {data?.next.map((subj, index) => (
            <Tr key={`${data.past.length + 2 + index}-${subj}`}>
              <Td>{data.past.length + 2 + index}</Td>
              <Td>{subj.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default TimetableTable;