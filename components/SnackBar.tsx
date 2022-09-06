import React, { FC} from "react";
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Props = SnackbarProps & AlertProps;

const SimpleSnackbar: FC<Props> = (props) => {
  return (
    <div>
      <Snackbar open={props.open}
        autoHideDuration={6000}
        onClose={props.onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
        
        <Alert onClose={props.onClose} severity={props.severity} sx={{ width: '100%' }}>
    {props.message}
  </Alert>
        </Snackbar>
    </div>
  );
}

export default SimpleSnackbar;