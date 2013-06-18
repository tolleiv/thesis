# origin: http://sifter.org/~simon/journal/20061211.html
# further resource to get the context: http://www.stat.osu.edu/~dmsl/Koren_2009.pdf

require 'narray'

class Svd
    attr_accessor :i, :iB, :u, :uB
    def initialize f,s
	@features = f
	@samples = s
	# avoid overfitting	   
	@lambda = 0.02
	# primary learning rate - in addition learning has to converge to gamma^2
	@gamma = 0.005
	train()
    end
    def empty
	init = NVector.float(@features).fill!(0.1)
	@i = Array.new(7).fill { init.clone }
	@iB = Array.new(7, 0)
	@u = Array.new(5).fill { init.clone }
	@uB = Array.new(5, 0)
    end

    def predict u,i
	@iB[i]+@uB[u]
	(@u[u]*@i[i])
    end

    def train
	empty()
	@features.times do |feat|
	    puts "Going for feature #{feat}"
	    old = 0; uN = 0; iN = 0; x = 0
	    begin
		old = uN.abs+iN.abs
		@samples.each do |s|
		    u = s[0]; i = s[1]
		    err =  s[2] - predict(u,i)
		    uN = @u[u][feat] + @gamma * (err*@i[i][feat]-@lambda*@u[u][feat])
		    iN = @i[i][feat] + @gamma * (err*@u[u][feat]-@lambda*@i[i][feat])
	#	    uBn = @uB[u] + @gamma * (err-@lambda*@uB[u])
	#	    iBn = @iB[i] + @gamma * (err-@lambda*@iB[i])
		    @u[u][feat] = uN
		    @i[i][feat] = iN
	#	    @uB[uX] = uBn
	#	    @iB[iX] = iBn
		end
		x+=1
	    end while (old+@gamma**2 < uN.abs+iN.abs)
	    puts "learning feature #{feat} took #{x} iterations"
	end
    end

    def stats
	puts "User:"
	@u.each { |uR| uR.each {|v| print " %.2f" % v }; puts "" }
	puts "User biases:"
	puts @uB.inspect
	puts "Items:"
	@i.each { |iR| iR.each {|v| print " %.2f" % v }; puts "" }
	puts "Item biases:"
	puts @iB.inspect
    end
end



samples = [[0,0,5.0], [0,1,3.0], [0,2,2.5],
           [1,0,2.0], [1,1,2.5], [1,2,5.0], [1,3,2.0],
	   [2,0,2.5], [2,3,4.0], [2,4,4.5], [2,6,5.0],
	   [3,0,5.0], [3,2,3.0], [3,3,4.5], [3,5,4.0],
	   [4,0,4.0], [4,1,3.0], [4,2,2.0], [4,3,4.0], [4,4,3.5], [4,5,4.0]]

# amount of features - 2 works fine / 5 seems to be the maximum
features = 3
s = Svd.new(features, samples)
s.stats()
# And here's a prediction
puts "User 1 - Item 4: %.2f (should be close to 4)" % s.predict(0,3)
