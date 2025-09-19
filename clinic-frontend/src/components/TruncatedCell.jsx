import { useState } from "react";

/**
 * TruncatedCell - A reusable component for table cells that truncates long text and shows full content in a modal on click.
 * @param {string} text - The text to display and truncate.
 * @param {number} maxLength - Maximum number of characters to show before truncating (default: 30).
 * @param {string} label - Optional label for the modal title.
 */
export default function TruncatedCell({ text, maxLength = 30, label }) {
  const [showModal, setShowModal] = useState(false);
  if (!text) return null;
  const isTruncated = text.length > maxLength;
  const displayText = isTruncated ? text.slice(0, maxLength) + "..." : text;

  return (
    <>
      <span
        className={isTruncated ? "cursor-pointer text-blue-600 underline" : ""}
        title={isTruncated ? "Click to view full" : undefined}
        onClick={() => isTruncated && setShowModal(true)}
      >
        {displayText}
      </span>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-blue-600">{label || "Details"}</h2>
            <div className="mb-4 whitespace-pre-wrap break-words">{text}</div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
