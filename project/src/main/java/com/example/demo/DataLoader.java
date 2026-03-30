package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.demo.entity.Question;
import com.example.demo.entity.Student;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.StudentRepository;

import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(QuestionRepository repo, StudentRepository studentRepo) {
        return args -> {

            // ── Seed Admin ──────────────────────────────────────────
            if (studentRepo.findByUsername("admin").isEmpty()) {
                studentRepo.save(new Student("admin", "admin123", "ROLE_ADMIN"));
                System.out.println("✅ Admin account created.");
            }

            // ── Skip if questions already exist ────────────────────
            if (repo.count() > 0) {
                System.out.println("✅ Questions already loaded. Skipping seed.");
                return;
            }

            // ── Helper lambda ──────────────────────────────────────
            // addQ(question, A, B, C, D, correct, category, explanation)
            java.util.function.Consumer<Object[]> add = data -> {
                Question q = new Question();
                q.setQuestion((String) data[0]);
                q.setOptionA  ((String) data[1]);
                q.setOptionB  ((String) data[2]);
                q.setOptionC  ((String) data[3]);
                q.setOptionD  ((String) data[4]);
                q.setCorrectAnswer((String) data[5]);
                q.setCategory ((String) data[6]);
                q.setExplanation((String) data[7]);
                repo.save(q);
            };

            // ════════════════════════════════════════════
            // ☕ JAVA (4 questions)
            // ════════════════════════════════════════════
            add.accept(new Object[]{
                "Which of the following is NOT a feature of Java?",
                "Platform Independent", "Object-Oriented", "Pointers", "Robust",
                "Pointers",
                "Java",
                "Java does not support explicit pointer usage for security and simplicity. Unlike C/C++, memory management in Java is handled by the JVM Garbage Collector."
            });

            add.accept(new Object[]{
                "What does JVM stand for?",
                "Java Virtual Memory", "Java Virtual Machine", "Java Variable Method", "Java Visual Map",
                "Java Virtual Machine",
                "Java",
                "JVM (Java Virtual Machine) is the runtime engine that executes Java bytecode. It is what makes Java platform-independent — 'Write Once, Run Anywhere'."
            });

            add.accept(new Object[]{
                "Which keyword is used to inherit a class in Java?",
                "implements", "inherits", "extends", "super",
                "extends",
                "Java",
                "The 'extends' keyword is used for class inheritance in Java. A child class extends a parent class to inherit its fields and methods. 'implements' is used for interfaces."
            });

            add.accept(new Object[]{
                "What is the default value of an int variable in Java?",
                "null", "1", "0", "undefined",
                "0",
                "Java",
                "In Java, instance variables of type int are automatically initialized to 0. Local variables must be explicitly initialized before use."
            });

            // ════════════════════════════════════════════
            // 🔷 OOP (3 questions)
            // ════════════════════════════════════════════
            add.accept(new Object[]{
                "Which OOP concept allows a class to have multiple methods with the same name but different parameters?",
                "Overriding", "Encapsulation", "Overloading", "Abstraction",
                "Overloading",
                "OOP",
                "Method Overloading (compile-time polymorphism) allows multiple methods with the same name but different parameter lists. This is resolved at compile time, unlike Method Overriding which happens at runtime."
            });

            add.accept(new Object[]{
                "Which pillar of OOP hides internal implementation details?",
                "Inheritance", "Polymorphism", "Abstraction", "Encapsulation",
                "Abstraction",
                "OOP",
                "Abstraction hides complex implementation and shows only essential features. It is achieved using abstract classes and interfaces. Encapsulation is about data hiding using access modifiers."
            });

            add.accept(new Object[]{
                "What does the 'super' keyword do in Java?",
                "Creates a new object", "Refers to the parent class", "Ends the program", "Declares a static method",
                "Refers to the parent class",
                "OOP",
                "The 'super' keyword in Java refers to the immediate parent class. It is used to call the parent class constructor (super()), access parent methods (super.method()), or parent fields that are hidden by the child class."
            });

            // ════════════════════════════════════════════
            // 📊 DSA (4 questions)
            // ════════════════════════════════════════════
            add.accept(new Object[]{
                "What is the time complexity of Binary Search?",
                "O(n)", "O(n²)", "O(log n)", "O(1)",
                "O(log n)",
                "DSA",
                "Binary Search divides the search space in half with each step, giving O(log n) time complexity. It requires the array to be sorted. Linear Search has O(n) complexity."
            });

            add.accept(new Object[]{
                "Which data structure follows LIFO (Last In First Out)?",
                "Queue", "Stack", "Linked List", "Tree",
                "Stack",
                "DSA",
                "A Stack follows LIFO — the last element added is the first to be removed. Operations: push() adds, pop() removes, peek() views the top. Used in: undo operations, browser back button, function call stack."
            });

            add.accept(new Object[]{
                "What is the worst-case time complexity of Quick Sort?",
                "O(n log n)", "O(n)", "O(n²)", "O(log n)",
                "O(n²)",
                "DSA",
                "Quick Sort has worst-case O(n²) when the pivot is always the smallest or largest element (already sorted array). Its average case is O(n log n). Merge Sort guarantees O(n log n) in all cases."
            });

            add.accept(new Object[]{
                "Which of the following is a non-linear data structure?",
                "Array", "Queue", "Stack", "Tree",
                "Tree",
                "DSA",
                "Trees are non-linear because elements are arranged hierarchically, not sequentially. Arrays, Queues, and Stacks are linear data structures. Graphs are also non-linear."
            });

            // ════════════════════════════════════════════
            // 🗄️ DBMS (2 questions)
            // ════════════════════════════════════════════
            add.accept(new Object[]{
                "Which SQL command is used to retrieve data from a database?",
                "INSERT", "UPDATE", "SELECT", "DELETE",
                "SELECT",
                "DBMS",
                "SELECT is used to fetch data from one or more tables. Example: SELECT * FROM students WHERE score > 50. INSERT adds new rows, UPDATE modifies existing ones, DELETE removes them."
            });

            add.accept(new Object[]{
                "What does ACID stand for in database transactions?",
                "Access, Control, Insert, Delete", "Atomicity, Consistency, Isolation, Durability", "Array, Class, Interface, Data", "Abstraction, Concurrency, Index, Dependency",
                "Atomicity, Consistency, Isolation, Durability",
                "DBMS",
                "ACID properties ensure reliable database transactions: Atomicity (all or nothing), Consistency (data remains valid), Isolation (transactions don't interfere), Durability (committed data persists even after crashes)."
            });

            // ════════════════════════════════════════════
            // 💻 OS (2 questions)
            // ════════════════════════════════════════════
            add.accept(new Object[]{
                "What is a deadlock in an operating system?",
                "A virus attack", "When CPU usage is 100%", "When two processes wait forever for each other's resources", "A type of memory leak",
                "When two processes wait forever for each other's resources",
                "OS",
                "Deadlock occurs when two or more processes are blocked, each waiting for a resource held by the other. Four conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. Breaking any one condition prevents deadlock."
            });

            add.accept(new Object[]{
                "Which scheduling algorithm gives the CPU to the process with the shortest burst time first?",
                "FCFS", "Round Robin", "SJF", "Priority Scheduling",
                "SJF",
                "OS",
                "SJF (Shortest Job First) selects the process with the minimum CPU burst time first, minimizing average waiting time. It can be preemptive (SRTF) or non-preemptive. Its main drawback is starvation of long processes."
            });

            System.out.println("✅ 15 sample questions seeded successfully across Java, OOP, DSA, DBMS & OS!");
        };
    }
}