import React from 'react';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';
import { ArrowLeft, List, User, Phone, Mail, Settings, Info, HelpCircle, LogOut } from 'lucide-react';

interface ProfileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOrdersClick?: () => void;
}

export const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
  isOpen,
  onClose,
  onOrdersClick,
}) => {
  if (!isOpen) return null;
  const { backgroundColor, primaryColor, secondaryColor, textColor, accentColor } =
    useWhiteLabelColors();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-md sm:max-w-lg h-[100vh] shadow-2xl overflow-y-auto"
        style={{ backgroundColor: backgroundColor }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ borderColor: secondaryColor }}
        >
          <button onClick={onClose} className="p-3">
            <ArrowLeft className="w-7 h-7" stroke={textColor} />
          </button>
        </div>

        {/* Name */}
        <div className="px-[50px] mb-[40px] mt-2">
          <h2
            className="font-semibold arabic-text"
            style={{
              color: textColor,
              fontSize: '38px',
              lineHeight: '100%',
              letterSpacing: '-0.04em',
              textAlign: 'right',
            }}
          >
            مرحباً، سمير
          </h2>
        </div>

        {/* Content */}
        <div
          className="mx-auto mt-[40px] px-[23px] space-y-[40px]"
          style={{
            maxWidth: '385px',
            backgroundColor: backgroundColor,
          }}
        >
          {/* General */}
          <div>
            <h3
              className="text-base font-bold arabic-text mb-4"
              style={{ color: textColor }}
            >
              عامّة
            </h3>
            <button
  onClick={onOrdersClick}
  className="w-full flex items-center justify-between py-3 border-b transition-colors"
  style={{ borderColor: secondaryColor, backgroundColor: backgroundColor }}
>
  {/* أيقونة على اليمين + النص */}
  <div className="flex items-center gap-2">
    <List className="w-[17px] h-[18px]" stroke={textColor} />
    <span
      className="arabic-text text-[16px] font-normal"
      style={{ color: accentColor }}
    >
      طلباتي
    </span>
  </div>
</button>

          </div>

          {/* Personal */}
          <div>
            <h3
              className="text-base font-bold arabic-text mb-4"
              style={{ color: textColor }}
            >
              شخصي
            </h3>
           {/* Name */}
<div
  className="flex items-center justify-between py-3 border-b"
  style={{ borderColor: secondaryColor }}
>
  {/* Icon */}
  <User className="w-5 h-5 ml-3" stroke={textColor} />

  {/* Text */}
  <div className="flex-1 text-right arabic-text" style={{ color: accentColor }}>
    محمد الجراح
  </div>

  {/* Edit button */}
  <button className="text-sm arabic-text" style={{ color: primaryColor }}>
    عدّل
  </button>
</div>

{/* Phone */}
<div
  className="flex items-center justify-between py-3 border-b"
  style={{ borderColor: secondaryColor }}
>
  <Phone className="w-5 h-5 ml-3" stroke={textColor} />

  <div className="flex-1 text-right arabic-text" style={{ color: accentColor }}>
    +963943394968
  </div>

  <button className="text-sm arabic-text" style={{ color: primaryColor }}>
    عدّل
  </button>
</div>

{/* Email */}
<div
  className="flex items-center justify-between py-3 border-b"
  style={{ borderColor: secondaryColor }}
>
  <Mail className="w-5 h-5 ml-3" stroke={textColor} />

  <div className="flex-1 text-right arabic-text" style={{ color: accentColor }}>
    Demo@Gamain.com
  </div>

  <button className="text-sm arabic-text" style={{ color: primaryColor }}>
    عدّل
  </button>
</div>

          </div>

        {/* Other */}
<div>
  <h3
    className="text-base font-bold arabic-text mb-4"
    style={{ color: textColor }}
  >
    أُخرى
  </h3>

  {/* Settings */}
  <div
    className="flex items-center justify-between py-3 border-b"
    style={{ borderColor: secondaryColor }}
  >
    {/* Icon */}
    <Settings className="w-5 h-5 ml-3" stroke={textColor} />

    {/* Text */}
    <div className="flex-1 text-right arabic-text" style={{ color: accentColor }}>
      إعدادات الحساب
    </div>
  </div>

  {/* Privacy */}
  <div
    className="flex items-center justify-between py-3 border-b"
    style={{ borderColor: secondaryColor }}
  >
    <Info className="w-5 h-5 ml-3" stroke={textColor} />
    <div className="flex-1 text-right arabic-text" style={{ color: accentColor }}>
      الخصوصية
    </div>
  </div>

  {/* Support */}
  <div className="flex items-center justify-between py-3 border-b">
    <HelpCircle className="w-5 h-5 ml-3" stroke={textColor} />
    <div className="flex-1 text-right arabic-text" style={{ color: accentColor }}>
      الدعم
    </div>
  </div>
</div>

{/* Logout */}
<div>
  <button
    className="w-full flex items-center justify-between py-3"
    style={{ color: accentColor }}
  >
    <LogOut className="w-5 h-5 ml-3" stroke={accentColor} />
    <span className="flex-1 text-right arabic-text" style={{ color: accentColor }}>
      تسجيل الخروج
    </span>
  </button>
</div>

        </div>
      </div>
    </div>
  );
};
