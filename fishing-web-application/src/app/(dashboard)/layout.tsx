import { Layout } from "@/components/layout/layout";
import DashboardPage from "./dashboard/page";
import { getCurretUserAccess } from "@/actions/db-actions/current-user-access";


interface DashboardLayoutProps {
  children: React.ReactNode;
}

type Access = {[index: string]:any}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const currentAccess =  await getCurretUserAccess()
  return (
    <Layout currentAccess={currentAccess as Access}>
      {children}
    </Layout>
  );
}

