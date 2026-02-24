import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Search, Briefcase } from "lucide-react";

export default function Home({ params: { lang } }: { params: { lang: string } }) {
    const isRTL = lang === 'ar';

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
                <div className="container relative z-10 flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary mb-6">
                        {isRTL ? "وظيفتك التالية تبدأ هنا" : "Your Next Job Starts Here"}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
                        {isRTL
                            ? "ابحث عن فرص عمل مميزة في كبرى الشركات المصرية أو اعثر على الموظف المثالي لشركتك."
                            : "Find exceptional job opportunities at top Egyptian companies or discover the perfect candidate for your team."
                        }
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                        <Link
                            href={`/${lang}/jobs`}
                            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                        >
                            {isRTL ? "تصفح الوظائف" : "Browse Jobs"}
                            {isRTL ? <ArrowLeft className="mr-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                        </Link>
                        <Link
                            href={`/${lang}/company-request`}
                            className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            {isRTL ? "طلب توظيف (شركات)" : "Post a Job (Companies)"}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features / Categories Preview */}
            <section className="py-16 bg-slate-50">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 bg-background rounded-lg shadow-sm border">
                            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{isRTL ? "بحث سهل وسريع" : "Easy Search"}</h3>
                            <p className="text-muted-foreground">
                                {isRTL ? "فلاتر متقدمة للعثور على الوظيفة المناسبة لمهاراتك وخبراتك." : "Advanced filters to find the right job for your skills and experience."}
                            </p>
                        </div>

                        <div className="p-6 bg-background rounded-lg shadow-sm border">
                            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{isRTL ? "أفضل الشركات" : "Top Companies"}</h3>
                            <p className="text-muted-foreground">
                                {isRTL ? "فرص عمل موثوقة من شركات رائدة تم التحقق منها." : "Trusted opportunities from verified leading companies."}
                            </p>
                        </div>

                        <div className="p-6 bg-background rounded-lg shadow-sm border">
                            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{isRTL ? "مسارك المهني" : "Your Career Path"}</h3>
                            <p className="text-muted-foreground">
                                {isRTL ? "نساعدك في بناء مسار مهني ناجح وليس مجرد وظيفة." : "We help you build a successful career path, not just find a job."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
