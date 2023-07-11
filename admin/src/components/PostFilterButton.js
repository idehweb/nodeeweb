import { useListContext } from 'react-admin';
import { Button } from "@mui/material";
import ContentFilter from "@mui/icons-material/FilterList";

export default (props) => {
    // const { showFilter } = useListContext();
    return (
        <Button
            size="small"
            color="primary"
            // onClick={() => showFilter("main")}
            startIcon={<ContentFilter />}
        >
            Filter
        </Button>
    );
};