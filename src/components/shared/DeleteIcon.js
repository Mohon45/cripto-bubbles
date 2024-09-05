import React, { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";

const DeleteIcon = ({ onDelete, dropDownTop }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete && onDelete();
  };
  return (
    <div className="relative p-[10px] xl:p-[.75vw] rounded-full bg-lightGray max-w-fit">
      <MdOutlineDelete
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-xl xl:text-[1.45vw] font-bold text-white cursor-pointer"
      />

      {/* Dropdown  */}
      <div
        className={`absolute w-fit  ${
          dropDownTop ? "bottom-[100%]" : "top-[100%]"
        }  flex flex-col  bg-[#313131] gap-y-2 right-0 rounded-md  duration-300  text-white ${
          menuOpen ? "h-fit p-2 " : "h-0 p-0"
        }`}
      >
        {menuOpen && (
          <>
            <p
              onClick={handleDelete}
              className="flex items-center gap-2 font-semibold cursor-pointer"
            >
              <MdOutlineDelete className="text-lg " /> Confirm
            </p>
            <p
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 ml-[2px] font-semibold cursor-pointer"
            >
              <RxCross1 className="text-base " /> Cancel
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteIcon;
