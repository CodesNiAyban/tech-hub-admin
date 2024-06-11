import NoAccessAdmin from "@/components/no-access-admin";
import { checkRole } from "@/lib/role";
import { redirect } from "next/navigation";

const SignIn = () => {
    if (!checkRole("admin")) return <NoAccessAdmin />
    else return redirect("/admin/users");
}

export default SignIn;