/** Ilustrasi belanja makanan sehat untuk sisi kiri halaman masuk. Murni presentasi. */
export default function LoginIllustration() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 500 400" className="w-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Latar Belakang Blob Hijau */}
      <path
        d="M120 220C90 140 180 80 260 90C340 100 420 160 400 240C380 320 280 360 200 340C130 320 140 270 120 220Z"
        fill="#78B998"
        opacity="0.35"
      />
      <path
        d="M140 240C110 170 190 120 260 130C330 140 380 190 370 250C360 310 270 340 210 330C160 320 160 280 140 240Z"
        fill="#A2D6BC"
        opacity="0.5"
      />

      {/* Kantong Belanja Kertas */}
      <rect x="180" y="180" width="140" height="150" rx="12" fill="#E2BA87" />
      <path d="M180 180L190 200H310L320 180H180Z" fill="#D3A871" />
      <path d="M250 180V330" stroke="#D3A871" strokeWidth="2" strokeDasharray="4 4" />

      {/* Semangka */}
      <g transform="translate(300, 240)">
        <path d="M0 60C33 60 60 33 60 0H0V60Z" fill="#2E7D32" />
        <path d="M4 56C30 56 56 30 56 4H4V56Z" fill="#E53935" />
        <circle cx="18" cy="20" r="2" fill="#212121" />
        <circle cx="28" cy="35" r="2" fill="#212121" />
        <circle cx="38" cy="18" r="2" fill="#212121" />
        <circle cx="22" cy="40" r="2" fill="#212121" />
      </g>

      {/* Apel Segar */}
      <circle cx="310" cy="320" r="16" fill="#D32F2F" />
      <path d="M310 304C310 298 314 294 316 292" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
      <path d="M316 294C322 294 326 298 326 298" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />

      {/* Botol Susu Rendah Gula */}
      <rect x="150" y="240" width="28" height="65" rx="5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2" />
      <rect x="155" y="230" width="18" height="10" rx="2" fill="#0288D1" />
      <rect x="154" y="260" width="20" height="20" rx="3" fill="#E1F5FE" />

      {/* Pisang */}
      <path d="M290 325C310 325 330 310 340 295" stroke="#FBC02D" strokeWidth="9" strokeLinecap="round" />
      <path d="M285 335C305 335 325 320 335 305" stroke="#FBC02D" strokeWidth="8" strokeLinecap="round" />

      {/* Baguette & Sayuran dalam Kantong */}
      <path d="M200 130L220 200" stroke="#D7A15C" strokeWidth="22" strokeLinecap="round" />
      <path d="M230 140L245 200" stroke="#4CAF50" strokeWidth="18" strokeLinecap="round" />
      <path d="M270 135L260 200" stroke="#FF7043" strokeWidth="16" strokeLinecap="round" />

      {/* Pria dengan Keranjang Belanja */}
      <g transform="translate(60, 240)">
        {/* Kepala */}
        <circle cx="50" cy="25" r="10" fill="#F8BBD0" />
        <path d="M44 20C44 14 56 14 56 20" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
        {/* Badan (Baju Biru) */}
        <path d="M42 35C42 35 45 65 45 75H55C55 65 58 35 58 35Z" fill="#1976D2" />
        {/* Celana */}
        <path d="M45 75L35 125M55 75L62 125" stroke="#263238" strokeWidth="6" strokeLinecap="round" />
        {/* Sepatu Merah */}
        <ellipse cx="30" cy="127" rx="8" ry="4" fill="#D32F2F" />
        <ellipse cx="67" cy="127" rx="8" ry="4" fill="#D32F2F" />
        {/* Lengan Mendorong */}
        <path d="M46 42L75 60" stroke="#1976D2" strokeWidth="5" strokeLinecap="round" />

        {/* Keranjang Belanja Beroda */}
        <g transform="translate(70, 45)">
          {/* Gagang */}
          <path d="M5 15L15 25H60L50 65H15L10 15Z" fill="none" stroke="#607D8B" strokeWidth="3" strokeLinejoin="round" />
          <line x1="20" y1="35" x2="55" y2="35" stroke="#90A4AE" strokeWidth="2" />
          <line x1="18" y1="50" x2="48" y2="50" stroke="#90A4AE" strokeWidth="2" />
          {/* Isi Keranjang */}
          <circle cx="28" cy="30" r="7" fill="#E53935" />
          <rect x="36" y="22" width="10" height="15" rx="2" fill="#FFA000" />
          <circle cx="48" cy="28" r="6" fill="#43A047" />
          {/* Kaki & Roda */}
          <line x1="20" y1="65" x2="20" y2="78" stroke="#607D8B" strokeWidth="3" />
          <line x1="45" y1="65" x2="45" y2="78" stroke="#607D8B" strokeWidth="3" />
          <circle cx="20" cy="80" r="4" fill="#37474F" />
          <circle cx="45" cy="80" r="4" fill="#37474F" />
        </g>
      </g>

      {/* Badge Indikator Gula Hijau */}
      <g transform="translate(195, 80)" className="animate-bounce" style={{ animationDuration: "3s" }}>
        <rect width="110" height="30" rx="15" fill="#047857" />
        <circle cx="16" cy="15" r="6" fill="#10B981" />
        <text x="32" y="19" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
          Pilih Sadar Gula
        </text>
      </g>
    </svg>
  );
}
