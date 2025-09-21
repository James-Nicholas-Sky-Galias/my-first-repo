function calculateGrade(score) 
{
    if (score >= 90 && score <= 100) {
        return 'A';
    } else if (score >= 80) {
        return 'B';
    } else if (score >= 70) {
        return 'C';
    } else if (score >= 60) {
        return 'D';
    } else {
        return 'F';
    }
}

function showStars(rows)
{
    for (let i = 1; i <= rows; i++) 
    {
        let stars = "";
        for (let j = 1; j <= i; j++) 
        {
            stars += "*";
        }
        console.log(stars);
    }
}

function isPrime(n)
{
    if (n <= 1)
    {
        return "Not Prime";
    }
    
    // Faster to check up to only the square root of n because if n = a * b, then one of those factors must be <= sqrt(n) and after that the factors are just mirrored
    for ( let i = 2; i <= Math.sqrt(n); i++ ) 
    {
        if ( n % i === 0 )
        {
            return "Not Prime";
        }
    }
    return "Prime";
}

function multiplicationTable(n)
{
    for (let i = 1; i <= 10; i++)
    {
        console.log(n + " x " + i + " = " + (n * i));
    }
}

let base = 1;

let score = base * 10 + 5;

let grade = calculateGrade(score);
console.log("Grade: " + grade);

console.log(" ");
let rows = base + 2;
showStars(rows);

console.log(" ");
let checkPrime = base + 10;
let primeResult = isPrime(checkPrime);
console.log(checkPrime + " is " + primeResult);

console.log(" ");
multiplicationTable(base);