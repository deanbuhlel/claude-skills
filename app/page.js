import SummarizerForm from './components/SummarizerForm';

export default function HomePage() {
  return (
    <div className="min-h-screen py-8">
      <h1 className="text-5xl font-display font-bold text-center text-primary-900 mb-12 animate-fade-in">
        AI Conversation Summarizer
      </h1>
      <SummarizerForm />
    </div>
  );
}
