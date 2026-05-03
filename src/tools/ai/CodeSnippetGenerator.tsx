import { useState } from 'react';
import { Code, Copy, RefreshCw, Play } from 'lucide-react';

type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'csharp' | 'php' | 'ruby' | 'go' | 'rust';

interface CodeSnippet {
  code: string;
  explanation: string;
  language: Language;
}

const CodeSnippetGenerator = () => {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [generatedSnippet, setGeneratedSnippet] = useState<CodeSnippet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'typescript', label: 'TypeScript', extension: 'ts' },
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'java', label: 'Java', extension: 'java' },
    { value: 'cpp', label: 'C++', extension: 'cpp' },
    { value: 'csharp', label: 'C#', extension: 'cs' },
    { value: 'php', label: 'PHP', extension: 'php' },
    { value: 'ruby', label: 'Ruby', extension: 'rb' },
    { value: 'go', label: 'Go', extension: 'go' },
    { value: 'rust', label: 'Rust', extension: 'rs' },
  ];

  const generateSnippet = () => {
    if (!description.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      const snippet = generateCodeSnippet(description, language);
      setGeneratedSnippet(snippet);
      setIsGenerating(false);
    }, 1500);
  };

  const generateCodeSnippet = (description: string, lang: Language): CodeSnippet => {
    const desc = description.toLowerCase().trim();

    let code = '';
    let explanation = '';

    // Common patterns
    if (desc.includes('hello world') || desc.includes('print hello')) {
      switch (lang) {
        case 'javascript':
        case 'typescript':
          code = 'console.log("Hello, World!");';
          explanation = 'Prints "Hello, World!" to the console.';
          break;
        case 'python':
          code = 'print("Hello, World!")';
          explanation = 'Prints "Hello, World!" to the console.';
          break;
        case 'java':
          code = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;
          explanation = 'A complete Java program that prints "Hello, World!" to the console.';
          break;
        case 'cpp':
          code = `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`;
          explanation = 'A complete C++ program that prints "Hello, World!" to the console.';
          break;
        case 'csharp':
          code = `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`;
          explanation = 'A complete C# program that prints "Hello, World!" to the console.';
          break;
        case 'php':
          code = '<?php\necho "Hello, World!";\n?>';
          explanation = 'Prints "Hello, World!" using PHP.';
          break;
        case 'ruby':
          code = 'puts "Hello, World!"';
          explanation = 'Prints "Hello, World!" using Ruby.';
          break;
        case 'go':
          code = `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`;
          explanation = 'A complete Go program that prints "Hello, World!" to the console.';
          break;
        case 'rust':
          code = `fn main() {
    println!("Hello, World!");
}`;
          explanation = 'A complete Rust program that prints "Hello, World!" to the console.';
          break;
      }
    } else if (desc.includes('function') || desc.includes('method')) {
      if (desc.includes('add') || desc.includes('sum')) {
        switch (lang) {
          case 'javascript':
          case 'typescript':
            code = `function addNumbers(a, b) {
    return a + b;
}

// Usage
const result = addNumbers(5, 3);
console.log(result); // Output: 8`;
            explanation = 'A function that adds two numbers and returns the result.';
            break;
          case 'python':
            code = `def add_numbers(a, b):
    return a + b

# Usage
result = add_numbers(5, 3)
print(result)  # Output: 8`;
            explanation = 'A function that adds two numbers and returns the result.';
            break;
          case 'java':
            code = `public class Calculator {
    public static int addNumbers(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int result = addNumbers(5, 3);
        System.out.println(result); // Output: 8
    }
}`;
            explanation = 'A method that adds two integers and returns the sum.';
            break;
        }
      } else if (desc.includes('fibonacci')) {
        switch (lang) {
          case 'javascript':
          case 'typescript':
            code = `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Usage
console.log(fibonacci(10)); // Output: 55`;
            explanation = 'A recursive function that calculates the nth Fibonacci number.';
            break;
          case 'python':
            code = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Usage
print(fibonacci(10))  # Output: 55`;
            explanation = 'A recursive function that calculates the nth Fibonacci number.';
            break;
        }
      } else {
        // Generic function
        switch (lang) {
          case 'javascript':
          case 'typescript':
            code = `function myFunction(param1, param2) {
    // Function body
    const result = param1 + param2;
    return result;
}

// Usage
const output = myFunction('Hello', ' World');
console.log(output); // Output: Hello World`;
            explanation = 'A basic function template that takes parameters and returns a result.';
            break;
          case 'python':
            code = `def my_function(param1, param2):
    # Function body
    result = param1 + param2
    return result

# Usage
output = my_function('Hello', ' World')
print(output)  # Output: Hello World`;
            explanation = 'A basic function that takes parameters and returns a result.';
            break;
        }
      }
    } else if (desc.includes('array') || desc.includes('list')) {
      if (desc.includes('sort')) {
        switch (lang) {
          case 'javascript':
          case 'typescript':
            code = `const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
const sorted = numbers.sort((a, b) => a - b);
console.log(sorted); // Output: [1, 1, 2, 3, 4, 5, 6, 9]`;
            explanation = 'Sorts an array of numbers in ascending order.';
            break;
          case 'python':
            code = `numbers = [3, 1, 4, 1, 5, 9, 2, 6]
sorted_numbers = sorted(numbers)
print(sorted_numbers)  # Output: [1, 1, 2, 3, 4, 5, 6, 9]`;
            explanation = 'Sorts a list of numbers in ascending order.';
            break;
        }
      } else if (desc.includes('filter') || desc.includes('find')) {
        switch (lang) {
          case 'javascript':
          case 'typescript':
            code = `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // Output: [2, 4, 6, 8, 10]`;
            explanation = 'Filters an array to get only even numbers.';
            break;
          case 'python':
            code = `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = [num for num in numbers if num % 2 == 0]
print(even_numbers)  # Output: [2, 4, 6, 8, 10]`;
            explanation = 'Filters a list to get only even numbers using list comprehension.';
            break;
        }
      } else {
        // Basic array/list operations
        switch (lang) {
          case 'javascript':
          case 'typescript':
            code = `// Create an array
const fruits = ['apple', 'banana', 'orange'];

// Add an item
fruits.push('grape');

// Access an item
console.log(fruits[0]); // Output: apple

// Get array length
console.log(fruits.length); // Output: 4

// Iterate through array
fruits.forEach(fruit => {
    console.log(fruit);
});`;
            explanation = 'Basic array operations: creation, adding items, accessing elements, and iteration.';
            break;
          case 'python':
            code = `# Create a list
fruits = ['apple', 'banana', 'orange']

# Add an item
fruits.append('grape')

# Access an item
print(fruits[0])  # Output: apple

# Get list length
print(len(fruits))  # Output: 4

# Iterate through list
for fruit in fruits:
    print(fruit)`;
            explanation = 'Basic list operations: creation, adding items, accessing elements, and iteration.';
            break;
        }
      }
    } else if (desc.includes('class') || desc.includes('object')) {
      switch (lang) {
        case 'javascript':
        case 'typescript':
          code = `class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        return \`Hello, my name is \${this.name} and I am \${this.age} years old.\`;
    }
}

// Usage
const person = new Person('Alice', 30);
console.log(person.greet());`;
          explanation = 'A class definition with constructor and methods.';
          break;
        case 'python':
          code = `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hello, my name is {self.name} and I am {self.age} years old."

# Usage
person = Person('Alice', 30)
print(person.greet())`;
          explanation = 'A class definition with constructor and methods.';
          break;
        case 'java':
          code = `public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String greet() {
        return "Hello, my name is " + name + " and I am " + age + " years old.";
    }

    public static void main(String[] args) {
        Person person = new Person("Alice", 30);
        System.out.println(person.greet());
    }
}`;
          explanation = 'A complete Java class with constructor, methods, and main method.';
          break;
      }
    } else if (desc.includes('api') || desc.includes('http') || desc.includes('fetch')) {
      switch (lang) {
        case 'javascript':
        case 'typescript':
          code = `// Fetch data from an API
async function fetchUserData(userId) {
    try {
        const response = await fetch(\`https://api.example.com/users/\${userId}\`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

// Usage
fetchUserData(123).then(user => {
    if (user) {
        console.log('User:', user);
    }
});`;
          explanation = 'An async function that fetches data from an API with error handling.';
          break;
        case 'python':
          code = `import requests

def fetch_user_data(user_id):
    try:
        response = requests.get(f'https://api.example.com/users/{user_id}')
        response.raise_for_status()  # Raise an exception for bad status codes
        user_data = response.json()
        return user_data
    except requests.RequestException as error:
        print(f'Error fetching user data: {error}')
        return None

# Usage
user = fetch_user_data(123)
if user:
    print('User:', user)`;
          explanation = 'A function that fetches data from an API using the requests library with error handling.';
          break;
      }
    } else if (desc.includes('file') || desc.includes('read') || desc.includes('write')) {
      switch (lang) {
        case 'javascript':
        case 'typescript':
          code = `// Read a file (Node.js environment)
const fs = require('fs');

function readFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
}

// Write to a file
function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('File written successfully');
    } catch (error) {
        console.error('Error writing file:', error);
    }
}

// Usage
const content = readFile('example.txt');
if (content) {
    writeFile('output.txt', content.toUpperCase());
}`;
          explanation = 'Functions to read from and write to files using Node.js fs module.';
          break;
        case 'python':
          code = `def read_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        return content
    except FileNotFoundError:
        print(f'File not found: {file_path}')
        return None
    except Exception as error:
        print(f'Error reading file: {error}')
        return None

def write_file(file_path, content):
    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
        print('File written successfully')
    except Exception as error:
        print(f'Error writing file: {error}')

# Usage
content = read_file('example.txt')
if content:
    write_file('output.txt', content.upper())`;
          explanation = 'Functions to read from and write to files with proper error handling.';
          break;
      }
    } else {
      // Default snippet based on language
      switch (lang) {
        case 'javascript':
        case 'typescript':
          code = `// Basic JavaScript example
const message = "Hello, World!";
console.log(message);

// Function example
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));`;
          explanation = 'A basic JavaScript snippet with variables, functions, and console output.';
          break;
        case 'python':
          code = `# Basic Python example
message = "Hello, World!"
print(message)

# Function example
def greet(name):
    return f"Hello, {name}!"

print(greet("Developer"))`;
          explanation = 'A basic Python snippet with variables, functions, and print statements.';
          break;
        case 'java':
          code = `public class Example {
    public static void main(String[] args) {
        String message = "Hello, World!";
        System.out.println(message);

        // Method example
        String greeting = greet("Developer");
        System.out.println(greeting);
    }

    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`;
          explanation = 'A complete Java program with main method and helper method.';
          break;
        default:
          code = `# This is a placeholder for ${lang} code
# Please provide a more specific description for better results`;
          explanation = `A placeholder snippet for ${lang}. Try describing a specific programming task.`;
      }
    }

    return {
      code,
      explanation,
      language: lang,
    };
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers or restricted environments
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Code copied to clipboard!');
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        alert('Unable to copy. Please select and copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  const regenerateSnippet = () => {
    generateSnippet();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Code className="w-5 h-5" />
          <h2 className="text-lg font-semibold">AI Code Generator</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">What do you want to code?</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Create a function to add two numbers, Sort an array, Make an API call..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Programming Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateSnippet}
              disabled={!description.trim() || isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Generate Code
                </>
              )}
            </button>
          </div>

          {/* Generated Code */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Generated Code</h3>
              {generatedSnippet && (
                <div className="flex gap-2">
                  <button
                    onClick={regenerateSnippet}
                    className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-accent"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>
              )}
            </div>

            {generatedSnippet ? (
              <div className="border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Explanation:</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {generatedSnippet.explanation}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {languages.find(l => l.value === generatedSnippet.language)?.label} Code:
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedSnippet.code)}
                      className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-accent"
                      title="Copy code"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                  <div className="text-sm bg-secondary/50 p-3 rounded whitespace-pre-wrap font-mono overflow-x-auto">
                    {generatedSnippet.code}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-border rounded-lg p-8 text-center text-muted-foreground">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Describe what you want to code and select a language to generate a snippet</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
          <h3 className="text-sm font-medium mb-2">💡 Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Be specific about what you want (e.g., "sort an array of numbers" vs "sort array")</li>
            <li>• Include the operation type (function, class, API call, file operation, etc.)</li>
            <li>• Mention any specific requirements or constraints</li>
            <li>• The generated code includes comments and error handling where appropriate</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetGenerator;