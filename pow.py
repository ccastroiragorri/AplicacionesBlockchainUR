import hashlib

def h(m):
	return hashlib.sha256(m).hexdigest()

def pow(n,j):
	found = False
	i = 0
	while (not found):
		m = n + str(i)
		if h(m)[0:j] == "0"*j:
			return "Found ", str(i), h(m)
		i = i + 1

n = "Aplicaciones Blockchain UR"
print pow(n,5)
