import { styled } from '@mui/system';

const CustomBackdrop = styled('div')({
    backdropFilter: 'blur(5px)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9, // Ensure it's above other content
   });

export default CustomBackdrop

export const CustomBackdrop2 = styled('div')({
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9, // Ensure it's above other content
   });
