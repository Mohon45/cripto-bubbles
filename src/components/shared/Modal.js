import { motion } from "framer-motion";

const dropIn = {
  hidden: {
    y: "-100vh",
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
  },
};

const Modal = ({
  onClose,
  children,
  className,
  smallHeight,
  containerStyle = {
    paddingTop: "50px",
  },
  removePadding,
}) => {
  return (
    <motion.div
      className={`fixed no-scrollbar inset-0 z-[9999] h-screen w-full bg-black/30 flex justify-center ${
        smallHeight ? "items-center" : "items-start"
      } pb-4  overflow-y-auto `}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        paddingTop: "50px",
        ...containerStyle,
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={`w-[90%]   h-auto sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[40vw] ${
          smallHeight ? "" : "min-h-[90vh]"
        }   !rounded-[15px]   overflow-y-auto ${className}`}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className={` w-full ${
            removePadding ? "" : "!p-4 xl:!p-[1.2vw]"
          } lg:mb-[5vw] bg-dark  !rounded-[15px] xl:!rounded-[1vw]`}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
