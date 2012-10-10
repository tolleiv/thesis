# origin: http://sifter.org/~simon/journal/20061211.html
# further resource to get the context: http://www.stat.osu.edu/~dmsl/Koren_2009.pdf

# same samples randomly assigned to three timeslots
samples = [
    [3,4,4.0,1],[5,1,4.0,1],[4,3,3.0,1],[5,5,3.5,1],[2,1,2.0,1],[4,1,5.0,1],[5,4,4.0,1],
    [4,6,4.0,2],[2,3,5.0,2],[1,3,2.5,2],[4,4,4.5,2],[1,1,5.0,2],[3,5,4.5,2],[3,7,5.0,2],
    [5,1,2.0,3],[3,1,2.5,3],[2,2,2.5,3],[2,4,2.0,3],[5,1,3.0,3],[5,6,4.0,3],[1,2,3.0,3]
]

# avoid overfitting	   
lambda=0.02
# primary learning rate - in addition learning has to converge to gamma^2
gamma=0.005
# amount of features - 2 works fine / 5 seems to be the maximum
features = 3
# initialize features - value is not really important
init = Array.new(features, 0.1)
u = Array.new(5).fill { init.clone }
uT = [2.33, 2.25,2,1.5,2.2]
uA = Array.new(5, 0)
uB = Array.new(5, 0)
i = Array.new(7).fill { init.clone }
iB = Array.new(7, 0)

def dot_product l1, l2
    sum = 0
    for i in 0...l1.size
        sum += l1[i] * l2[i]
    end
    sum
end

def user_bias uX,t,uA,uB,uT
    uB[uX]+uA[uX]*(t-uT[uX]).abs**0.4
end

def predict uX,iX,t,u,i,uA,uB,uT,iB
     iB[iX] + user_bias(uX,t,uA,uB,uT) + dot_product(i[iX],u[uX])
end

# training
features.times do |feat|
    old = 0; uN = 0; iN = 0; x = 0
    begin
	old = uN.abs+iN.abs
        samples.each do |s|
            uX = s[0]-1; iX = s[1]-1
            err = s[2] - (predict(uX,iX,s[3],u,i,uA,uB,uT,iB))
	    uN = u[uX][feat] + gamma * (err*i[iX][feat]-lambda*u[uX][feat])
	    iN = i[iX][feat] + gamma * (err*u[uX][feat]-lambda*i[iX][feat])
	    uAn = uA[uX] + gamma * (err-lambda*uA[uX])
	    uBn = uB[uX] + gamma * (err-lambda*uB[uX])
	    iBn = iB[iX] + gamma * (err-lambda*iB[iX])
	    u[uX][feat] = uN
	    i[iX][feat] = iN
	    uA[uX] = uAn
	    uB[uX] = uBn
	    iB[iX] = iBn
	end
	x+=1
    end while (old+gamma**2 < uN.abs+iN.abs)
    puts "learning feature #{feat} took #{x} iterations"
end

# let's see what we got:
puts "User:"
u.each { |uR| uR.each {|v| print " %.2f" % v }; puts "" }
puts "User alphas:"
puts uA.inspect
puts "User biases:"
puts uB.inspect
puts "Items:"
i.each { |iR| iR.each {|v| print " %.2f" % v }; puts "" }
puts "Item biases:"
puts iB.inspect
# And here's a prediction
[1,2,3].each { |t| puts "User 1 - Item 4 (#{t}): %.2f (should be close to 4)" % predict(0,3,t,u,i,uA,uB,uT,iB) }
