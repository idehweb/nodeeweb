import { ListBase, Pagination } from "react-admin";
import { Box } from "@mui/material";
import { CustomFileField, NoteList, List, SimpleForm, UploaderField } from "@/components";


const list = (props) => {
  console.log("props", props);
  return (
    <ListBase
      perPage={20}
      sort={{ field: "reference", order: "ASC" }}
      {...props}
    >
      <Box className={"grid-box"}>
        <NoteList {...props} />
      </Box>
      <Pagination rowsPerPageOptions={[10, 20, 40]}/>

    </ListBase>
  );
};


export default list;
