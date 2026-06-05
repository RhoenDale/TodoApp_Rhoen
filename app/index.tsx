import { useAuth } from '@/contexts/auth-context';
import { Redirect } from 'expo-router';

export default function Index() {
  const { token } = useAuth();
  
  if (token) {
    return <Redirect href="/(app)/tasks" />;
  }

  return <Redirect href="/auth/login" />;
}
