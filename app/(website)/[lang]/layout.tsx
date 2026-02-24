import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Jahez | جاهز - منصة التوظيف",
        template: "%s | Jahez",
    },
    description: "منصة التوظيف الرائدة في مصر. اعثر على وظيفتك التالية أو ابحث عن أفضل المواهب.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <>
            {children}
        </>
    );
}
