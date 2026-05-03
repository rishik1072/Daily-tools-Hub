import { Suspense, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { tools } from '../tools';
import { useAppStore } from '../store/store';

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { addRecent } = useAppStore();

  const tool = tools.find((t) => t.id === toolId);

  useEffect(() => {
    if (tool) {
      addRecent(tool.id);
    }
  }, [tool, addRecent]);

  if (!tool) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md rounded-3xl border border-border bg-secondary p-6 text-center shadow-lg shadow-black/5">
          <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
          <p className="mb-6 text-sm leading-6 text-muted-foreground">
            The tool you're looking for isn't available right now. Return to the toolbox and try again.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Back to toolbox
          </button>
        </div>
      </div>
    );
  }

  const ToolComponent = tool.component;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={tool.name} subtitle={tool.description} showBack />
      <main className="max-w-3xl mx-auto p-4">
        <Suspense
          fallback={
            <div className="rounded-3xl border border-border bg-secondary p-6 text-center text-sm text-muted-foreground">
              Loading tool...
            </div>
          }
        >
          <ToolComponent />
        </Suspense>
      </main>
    </div>
  );
};

export default ToolPage;