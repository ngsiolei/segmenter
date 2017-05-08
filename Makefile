default: test

PASS=echo PASS
FAIL=echo FAIL

test:
	@for i in test-*.js; do \
		echo "$$i: "; \
		node $$i 2>/dev/null > /dev/null && $(PASS) || $(FAIL); \
		echo "---"; \
	done

.PHONY: test
