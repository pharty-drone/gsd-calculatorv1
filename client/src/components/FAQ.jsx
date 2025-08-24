import React, { useState } from 'react';

const faqs = [
  {
    question: 'What is GSD?',
    answer: (
      <>
        Ground Sample Distance (GSD) represents the real-world size of a pixel in an image. Smaller GSD means higher detail.{' '}
        <a
          href="https://en.wikipedia.org/wiki/Ground_sample_distance"
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
        .
      </>
    ),
  },
  {
    question: 'Why does roof height affect GSD?',
    answer:
      'The effective altitude of your camera is flight altitude minus roof height. A lower distance to the subject results in a smaller GSD.',
  },
  {
    question: 'How should I set my overlap values?',
    answer: (
      <>
        For mapping, aim for at least 70% frontlap and 60% sidelap to ensure good coverage and 3D reconstruction.{' '}
        <a
          href="https://support.pix4d.com/hc/en-us/articles/202557349-What-is-overlap-and-how-much-is-required-"
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read guidelines
        </a>
        .
      </>
    ),
  },
];

export default function FAQ() {
  return (
    <section className="max-w-2xl mx-auto mt-8" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-semibold mb-4">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {faqs.map((faq, idx) => (
          <FAQItem key={idx} faq={faq} idx={idx} />
        ))}
      </div>
    </section>
  );
}

function FAQItem({ faq, idx }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="w-full flex justify-between items-center py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`faq-panel-${idx}`}
        id={`faq-control-${idx}`}
      >
        <span className="font-medium">{faq.question}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={`faq-panel-${idx}`}
        role="region"
        aria-labelledby={`faq-control-${idx}`}
        className={`px-4 pb-4 text-sm text-gray-700 dark:text-gray-300 transition-all duration-300 overflow-hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <p>{faq.answer}</p>
      </div>
    </div>
  );
}
