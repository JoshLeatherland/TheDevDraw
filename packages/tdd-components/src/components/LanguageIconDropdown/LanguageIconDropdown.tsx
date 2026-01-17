import TranslateIcon from "@mui/icons-material/TranslateRounded";
import IconButton, { IconButtonOwnProps } from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

type Language = "en" | "es" | "fr";

const LANGUAGES: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

function LanguageIconDropdown(props: IconButtonOwnProps) {
  const [language, setLanguage] = useState<Language>("en");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguage = (lang: Language) => () => {
    setLanguage(lang);
    handleClose();

    // plug into i18n here later:
    // i18n.changeLanguage(lang);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        disableRipple
        size="small"
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        {...props}
      >
        <TranslateIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="language-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            variant: "outlined",
            elevation: 0,
            sx: {
              my: "4px",
              minWidth: 160,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
          <MenuItem
            key={lang}
            selected={language === lang}
            onClick={handleLanguage(lang)}
          >
            {LANGUAGES[lang]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default LanguageIconDropdown;
