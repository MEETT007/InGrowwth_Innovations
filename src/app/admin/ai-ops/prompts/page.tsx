import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AiOpsPromptsPage() {
  return (
    <Card className="bg-background/40 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">Prompt Explorer (Coming Soon)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
          Prompt versioning and A/B testing will be implemented here.
        </div>
      </CardContent>
    </Card>
  );
}
